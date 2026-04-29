import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm/data-source/DataSource';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from 'src/entities/user.entity';
import { Booking } from 'src/entities/booking.entity';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { BookingStatus } from 'src/common/constants/enums';
import Redis from 'ioredis/built/Redis';

@Injectable()
export class BookingsService {
    constructor(
        @Inject('REDIS_CLIENT')
        private redis: Redis,
        private dataSource: DataSource) { }

    private calculateDuration(startTime: string, endTime: string): number {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        return endTotalMinutes - startTotalMinutes;
    }

    async createBooking(createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
        return await this.dataSource.transaction(async (manager) => {

            // lock slot
            const slot = await manager.findOne(TimeSlot, {
                where: { id: createBookingDto.timeSlotId },
                relations: ['court'],
                lock: { mode: 'pessimistic_write' },
            });
            if (
                createBookingDto.startTime !== slot.startTime ||
                createBookingDto.endTime !== slot.endTime
            ) {
                throw new BusinessException(ERROR_CODES.INVALID_TIME_RANGE);
            }

            if (!slot) {
                throw new BusinessException(ERROR_CODES.TIME_SLOT_NOT_FOUND, 'Time slot not found');
            }

            if (createBookingDto.courtId !== slot.courtId) {
                throw new BusinessException(ERROR_CODES.INVALID_COURT, 'Court không khớp với slot');
            }

            if (!slot.isAvailable) {
                throw new BusinessException(ERROR_CODES.TIME_SLOT_UNAVAILABLE, 'Time slot is not available');
            }

            const bookerName = createBookingDto.bookerName || user.fullName;
            const bookerPhone = createBookingDto.bookerPhone || user.phone;

            const todayBookingsCount = await manager.count(Booking, {
                where: { bookingDate: createBookingDto.bookingDate },
            });
            const dateString = createBookingDto.bookingDate.replace(/-/g, '');
            const sequence = (todayBookingsCount + 1).toString().padStart(3, '0');
            const bookingCode = `TH-${dateString}-${sequence}`;

            const durationHours = this.calculateDuration(createBookingDto.startTime, createBookingDto.endTime);
            const effectivePrice = Number(slot.priceOverride) || Number(slot.court.pricePerHour);
            const totalPrice = effectivePrice * durationHours;



            const newBooking = manager.create(Booking, {
                bookingCode,
                userId: user.id,
                courtId: createBookingDto.courtId,
                timeSlotId: createBookingDto.timeSlotId,
                bookingDate: createBookingDto.bookingDate,
                startTime: createBookingDto.startTime,
                endTime: createBookingDto.endTime,
                bookerName,
                bookerPhone,
                note: createBookingDto.note,
                totalPrice,
                status: BookingStatus.CONFIRMED,
            });

            slot.isAvailable = false;
            await manager.save(slot);
            return await manager.save(newBooking);
        });
    }

    async holdSlot(slotId: string, userId: string) {
        const key = `slot:hold:${slotId}`;

        const result = await this.redis.set(key, userId, 'EX', 300, 'NX');

        if (!result) {
            throw new BusinessException(ERROR_CODES.SLOT_HOLD_FAILED);
        }

        return {
            message: 'Giữ slot thành công',
            expiresIn: 300,
        };
    }


    async confirmBooking(slotId: string, user: User) {
        const key = `slot:hold:${slotId}`;

        const holder = await this.redis.get(key);

        if (!holder) {
            throw new BusinessException(ERROR_CODES.SLOT_HOLD_FAILED);
        }

        if (holder !== user.id) {
            throw new BusinessException(ERROR_CODES.SLOT_HOLD_FAILED);
        }

        return this.dataSource.transaction(async (manager) => {

            const slot = await manager.findOne(TimeSlot, {
                where: { id: slotId },
                lock: { mode: 'pessimistic_write' },
            });

            if (!slot) throw new BusinessException(ERROR_CODES.TIME_SLOT_NOT_FOUND);

            if (!slot.isAvailable) throw new BusinessException(ERROR_CODES.TIME_SLOT_UNAVAILABLE);
            const existing = await manager.findOne(Booking, {
                where: { timeSlotId: slotId },
            });

            if (existing) {
                throw new BusinessException(ERROR_CODES.SLOT_HOLD_FAILED);
            }

            const booking = manager.create(Booking, {
                userId: user.id,
                timeSlotId: slotId,
                courtId: slot.courtId,
                bookingDate: slot.slotDate,
                startTime: slot.startTime,
                endTime: slot.endTime,
                status: BookingStatus.CONFIRMED,
            });

            const saved = await manager.save(booking);

            await this.redis.del(key);

            return saved;
        });
    }
}
