import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Type } from 'class-transformer';
import { Booking } from 'src/entities/booking.entity';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Court } from 'src/entities/court.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Booking,TimeSlot,Court])],
  controllers: [BookingsController],
  providers: [BookingsService] ,
  exports: [BookingsService],
})
export class BookingsModule {}
