import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Court } from 'src/entities/court.entity';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateSlotsDto } from './dto/create-slots.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { UpdateCourtDto } from 'src/courts/dto/update-court.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class TimeSlotsService {
    constructor(
        @InjectRepository(TimeSlot)
        private readonly timeSlotRepository: Repository<TimeSlot>,

        @InjectRepository(Court)
        private readonly courtRepository: Repository<Court>,

        private readonly dataSource: DataSource,
    ) { }

    // async createTimeSlots(courtId: string, createSlotsDto: CreateSlotsDto): Promise<TimeSlot[]> {
    //     const { slotDate, slots } = createSlotsDto;

    //     const startTimes = slots.map(slot => slot.startTime);

    //     if (startTimes.length !== new Set(startTimes).size) {
    //         throw new BusinessException(ERROR_CODES.DUPLICATE_START_TIMES, 'Các startTime trong cùng một ngày không được trùng nhau');
    //     }

    //     const court = await this.courtRepository.findOne({ where: { id: courtId } });
    //     if (!court) {
    //         throw new BusinessException(ERROR_CODES.COURT_NOT_FOUND);
    //     }
    //     this.checkOverlap(slots);

    //     const conflict = await this.timeSlotRepository
    //         .createQueryBuilder('slot')
    //         .where('slot.courtId = :courtId', { courtId })
    //         .andWhere('slot.slotDate = :date', { slotDate })
    //         .andWhere('slot.startTime < :endTime', { endTime })
    //         .andWhere('slot.endTime > :startTime', { startTime })
    //         .getOne();

    //     if (conflict) {
    //         throw new BusinessException(ERROR_CODES.TIME_SLOTS_OVERLAP, 'Khung giờ bị trùng với slot đã tồn tại');
    //     }

    //     const newSlots = slots.map(slot => {
    //         return this.timeSlotRepository.create({
    //             courtId,
    //             slotDate,
    //             startTime: slot.startTime,
    //             endTime: slot.endTime,
    //             priceOverride: slot.priceOverride,
    //         });
    //     });

    //     await this.timeSlotRepository.createQueryBuilder()
    //         .insert()
    //         .into(TimeSlot)
    //         .values(newSlots)
    //         .orIgnore()
    //         .execute();

    //     return this.findByCourtDate(courtId, slotDate);
    // }

    async createTimeSlots(courtId: string, createSlotsDto: CreateSlotsDto): Promise<TimeSlot[]> {
        const { slotDate, slots } = createSlotsDto;

        const court = await this.courtRepository.findOne({ where: { id: courtId } });
        if (!court) throw new BusinessException(ERROR_CODES.COURT_NOT_FOUND);

        this.validateInputSlots(slots);

        for (const slot of slots) {
            const conflict = await this.timeSlotRepository
                .createQueryBuilder('slot')
                .where('slot.courtId = :courtId', { courtId })
                .andWhere('slot.slotDate = :slotDate', { slotDate })
                .andWhere('slot.startTime < :endTime', { endTime: slot.endTime })
                .andWhere('slot.endTime > :startTime', { startTime: slot.startTime })
                .getOne();

            if (conflict) {
                throw new BusinessException(
                    ERROR_CODES.TIME_SLOTS_OVERLAP,
                    `Slot ${slot.startTime}-${slot.endTime} bị trùng`,
                );
            }
        }

        const newSlots = slots.map(slot =>
            this.timeSlotRepository.create({
                courtId,
                slotDate,
                ...slot,
            })
        );

        try {
            await this.timeSlotRepository.save(newSlots);
        } catch (error) {
            throw new BusinessException(
                ERROR_CODES.TIME_SLOTS_OVERLAP,
                'Có slot bị trùng với dữ liệu đã tồn tại',
            );
        }

        return this.dataSource.transaction(async (manager) => {
            const repo = manager.getRepository(TimeSlot);

            await repo.save(newSlots);

            return repo.find({
                where: { courtId, slotDate },
                order: { startTime: 'ASC' },
            });
        });
    }

    private validateInputSlots(slots: { startTime: string; endTime: string }[]) {
        const toMin = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        for (const slot of slots) {
            if (toMin(slot.startTime) >= toMin(slot.endTime)) {
                throw new BusinessException(
                    ERROR_CODES.INVALID_TIME_RANGE,
                    `Slot ${slot.startTime}-${slot.endTime} không hợp lệ`,
                );
            }
        }
        const startTimes = slots.map(s => s.startTime);
        if (startTimes.length !== new Set(startTimes).size) {
            throw new BusinessException(ERROR_CODES.DUPLICATE_START_TIMES, 'Các startTime không được trùng nhau');
        }

        this.checkOverlap(slots);
    }

    async findByCourtDate(courtId: string, date: string): Promise<TimeSlot[]> {
        return this.timeSlotRepository.find({
            where: {
                courtId,
                slotDate: date
            },
            order: { startTime: 'ASC' },
        });
    }

    async updateSlot(courtId: string, slotId: string, updateSlotDto: UpdateCourtDto): Promise<TimeSlot> {
        const slot = await this.timeSlotRepository.findOne({
            where: { id: slotId, courtId }
        });

        if (!slot) throw new BusinessException(ERROR_CODES.TIME_SLOT_NOT_FOUND);

        Object.assign(slot, updateSlotDto);
        return this.timeSlotRepository.save(slot);
    }

    private checkOverlap(slots: { startTime: string; endTime: string }[]) {
        const toMinutes = (time: string) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        };

        const sorted = slots
            .map(s => ({
                start: toMinutes(s.startTime),
                end: toMinutes(s.endTime),
            }))
            .sort((a, b) => a.start - b.start);

        for (let i = 1; i < sorted.length; i++) {
            const prev = sorted[i - 1];
            const curr = sorted[i];

            if (curr.start < prev.end) {
                throw new BusinessException(
                    ERROR_CODES.TIME_SLOTS_OVERLAP,
                    'Các khung giờ bị chồng lấn (overlap)',
                );
            }
        }
    }
}