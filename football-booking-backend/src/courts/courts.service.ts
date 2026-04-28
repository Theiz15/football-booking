import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Court } from 'src/entities/court.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { BusinessException } from 'src/common/exceptions/business.exception';
import { ERROR_CODES } from 'src/common/constants/error-codes';
import { CourtResponseDto } from './dto/court-response.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { QueryCourtDto } from './dto/query-court.dto';

@Injectable()
export class CourtsService {
    constructor(
        @InjectRepository(Court)
        private courtsRepository: Repository<Court>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async create(createCourtDto: CreateCourtDto, file: Express.Multer.File): Promise<CourtResponseDto> {
        const uploadResult = await this.cloudinaryService.uploadImage(file);

        try {
            const newCourt = this.courtsRepository.create({
                ...createCourtDto,
                imageUrl: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            });
            const savedCourt = await this.courtsRepository.save(newCourt);

            return new CourtResponseDto(savedCourt);
        } catch (error) {
            await this.cloudinaryService.deleteImage(uploadResult.public_id);
            throw new BusinessException(ERROR_CODES.COURT_CREATION_FAILED, 'Failed to create court');
        }
    }

    async update(id: string, updateCourtDto: UpdateCourtDto, file?: Express.Multer.File): Promise<CourtResponseDto> {
        const court = await this.courtsRepository.findOne({ where: { id } });
        if (!court) throw new BusinessException(ERROR_CODES.COURT_NOT_FOUND, 'Không tìm thấy sân này');

        let newImageUrl = court.imageUrl;
        let newImagePublicId = court.publicId;
        let oldImagePublicId = null;

        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file);
            newImageUrl = uploadResult.secure_url;
            newImagePublicId = uploadResult.public_id;
            oldImagePublicId = court.publicId;
        }

        try {
            Object.assign(court, {
                ...updateCourtDto,
                imageUrl: newImageUrl,
                publicId: newImagePublicId,
            });

            const updatedCourt = await this.courtsRepository.save(court);

            if (oldImagePublicId) {
                await this.cloudinaryService.deleteImage(oldImagePublicId);
            }

            return new CourtResponseDto(updatedCourt);
        } catch (error) {
            if (file && newImagePublicId) {
                await this.cloudinaryService.deleteImage(newImagePublicId);
            }
            throw new BusinessException(ERROR_CODES.INTERNAL_ERROR, 'Cập nhật thất bại.');
        }
    }

    async softDelete(id: string): Promise<void> {
        const result = await this.courtsRepository.softDelete(id);
        if (result.affected === 0) {
            throw new BusinessException(ERROR_CODES.COURT_NOT_FOUND, 'Không tìm thấy sân để xóa');
        }
        return;
    }

    async findAll(query: QueryCourtDto): Promise<PaginatedResponseDto<CourtResponseDto>> {
        const { page = 1, limit = 10, name, address, city, district, courtType } = query;

        const qb = this.courtsRepository.createQueryBuilder('court').where('court.isActive = :isActive', { isActive: true });
        if (name) {
            qb.andWhere('court.name ILIKE :name', { name: `%${name}%` });
        }
        if (address) {
            qb.andWhere('court.address = :address', { address });
        }
        if (city) {
            qb.andWhere('court.city = :city', { city });

        }

        if (district) {
            qb.andWhere('court.district = :district', { district });
        }

        if (courtType) {
            qb.andWhere('court.courtType = :courtType', { courtType });
        }

        const skip = (page - 1) * limit;
        qb.skip(skip).take(limit);
        
        qb.orderBy('court.createdAt', 'DESC');

        const [courts, total] = await qb.getManyAndCount();
        const data = courts.map(court => new CourtResponseDto(court));
        return new PaginatedResponseDto(data, total, page, limit);
    }
}