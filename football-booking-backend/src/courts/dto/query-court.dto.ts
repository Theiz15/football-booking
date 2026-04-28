import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class QueryCourtDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    name?: string;  

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString() 
    city?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    courtType?: string;
}