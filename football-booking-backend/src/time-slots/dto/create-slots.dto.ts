import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber, Matches, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class SlotDetailDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'startTime phải theo định dạng HH:mm' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'endTime phải theo định dạng HH:mm' })
  endTime: string;

  @IsOptional()
  @IsNumber()
  priceOverride?: number;
}

export class CreateSlotsDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'slotDate phải theo định dạng YYYY-MM-DD' })
  slotDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SlotDetailDto)
  slots: SlotDetailDto[];
}