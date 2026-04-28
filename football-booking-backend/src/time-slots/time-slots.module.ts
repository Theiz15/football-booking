import { Module } from '@nestjs/common';
import { TimeSlotsController } from './time-slots.controller';
import { TimeSlotsService } from './time-slots.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Court } from 'src/entities/court.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot, Court])],
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService] ,
  exports: [TimeSlotsService]
})
export class TimeSlotsModule {}
