import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './user.entity'; 
import { Court } from './court.entity';
import { TimeSlot } from './time-slot.entity';
import { BookingStatus, PaymentStatus } from '../common/constants/enums';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'booking_code', unique: true, length: 20 })
  bookingCode: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'booker_name', length: 100 })
  bookerName: string;

  @Column({ name: 'booker_phone', length: 15 })
  bookerPhone: string;

  @Column({ name: 'court_id' })
  courtId: string;

  @ManyToOne(() => Court, (court) => court.bookings)
  @JoinColumn({ name: 'court_id' })
  court: Court;

  @Column({ name: 'time_slot_id' })
  timeSlotId: string;

  @ManyToOne(() => TimeSlot)
  @JoinColumn({ name: 'time_slot_id' })
  timeSlot: TimeSlot;

  @Column({ type: 'date', name: 'booking_date' })
  bookingDate: string;

  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, name: 'duration_hours' })
  durationHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_price' })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'deposit_amount', default: 0 })
  depositAmount: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID, name: 'payment_status' })
  paymentStatus: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'text', name: 'staff_note', nullable: true })
  staffNote: string;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: string;

  @Column({ name: 'cancelled_at', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancel_reason', nullable: true })
  cancelReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}