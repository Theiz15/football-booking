import { IsNotEmpty, Matches } from 'class-validator';

export class GetScheduleDto {
  @IsNotEmpty({ message: 'Vui lòng cung cấp ngày xem lịch' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Định dạng ngày phải là YYYY-MM-DD' })
  date: string;
}