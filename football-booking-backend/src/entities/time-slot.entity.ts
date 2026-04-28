import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index, Unique, UpdateDateColumn } from 'typeorm';
import { Court } from './court.entity';

@Entity('time_slots')
@Index(['courtId', 'slotDate'])
@Unique(['courtId', 'slotDate', 'startTime'])
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'court_id', type: 'uuid' })
  courtId: string;

  @ManyToOne(() => Court, (court) => court.timeSlots)
  @JoinColumn({ name: 'court_id' })
  court: Court;

  @Column({ type: 'date', name: 'slot_date' })
  slotDate: string;

  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'price_override', nullable: true })
  priceOverride: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}