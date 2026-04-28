import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CourtType, SurfaceType } from '../../common/constants/enums';

export class CreateCourtDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    courtType: CourtType;

    @IsNotEmpty()
    @IsString()
    surfaceType: SurfaceType;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    capacity: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    pricePerHour: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    priceWeekend: number;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    ward?: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    amenities?: string;
}