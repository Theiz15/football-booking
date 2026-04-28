import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Court } from './court.entity';

@Entity('time_slots')
@Index(['courtId', 'slotDate'])
export class TimeSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'court_id' })
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}