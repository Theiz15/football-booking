import { Module } from '@nestjs/common';
import { CourtsController } from './courts.controller';
import { CourtsService } from './courts.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ConfigModule } from '@nestjs/config';
import { Court } from 'src/entities/court.entity';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { Booking } from 'src/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Court ,TimeSlot,Booking]),
    ConfigModule, 
  ],
  controllers: [CourtsController],
  providers: [CourtsService, CloudinaryService],
})
export class CourtsModule {}
