import { IsNotEmpty, IsString, IsOptional, IsUUID, Matches } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsUUID()
  courtId: string;

  @IsNotEmpty()
  @IsUUID()
  timeSlotId: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'bookingDate phải theo định dạng YYYY-MM-DD' })
  bookingDate: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime phải theo định dạng HH:mm' })
  startTime: string;

  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime phải theo định dạng HH:mm' })
  endTime: string;

  @IsOptional()
  @IsString()
  bookerName?: string;

  @IsOptional()
  @IsString()
  bookerPhone?: string;

  @IsOptional()
  @IsString()
  note?: string;
}