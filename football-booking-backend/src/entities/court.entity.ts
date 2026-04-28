import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { CourtType, SurfaceType } from '../common/constants/enums'; 
import { TimeSlot } from './time-slot.entity';
import { Booking } from './booking.entity';
import { Exclude } from 'class-transformer';

@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'enum', enum: CourtType })
  courtType: CourtType;

  @Column({ type: 'enum', enum: SurfaceType, default: SurfaceType.ARTIFICIAL_GRASS })
  surfaceType: SurfaceType;

  @Column({ type: 'smallint' })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePerHour: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceWeekend: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  ward: string;

  @Column()
  district: string;

  @Column({ default: 'Ho Chi Minh' })
  city: string;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'public_id', length: 255, nullable: true })
  @Exclude()
  publicId: string; 

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  amenities: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.court)
  timeSlots: TimeSlot[];

  @OneToMany(() => Booking, (booking) => booking.court)
  bookings: Booking[];
}