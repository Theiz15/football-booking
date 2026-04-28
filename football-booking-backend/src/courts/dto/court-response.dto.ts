import { Court } from '../../entities/court.entity';

export class CourtResponseDto {
  id!: string;
  name!: string;
  courtType!: string;
  surfaceType!: string;
  capacity!: number;
  pricePerHour!: number;
  priceWeekend?: number;
  address!: string;
  ward?: string;
  district!: string;
  city!: string;
  imageUrl!: string;

  constructor(partial: Partial<Court>) {
    Object.assign(this, partial);
    
    delete (this as any).imagePublicId;
    delete (this as any).deletedAt;
  }
}