import { Controller, Delete, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors, Body, Query, Get, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/constants/enums';
import { CourtsService } from './courts.service';
import { CreateCourtDto } from './dto/create-court.dto';
import { FileValidationPipe } from '../common/pipes/file-validation.pipe';
import { UpdateCourtDto } from './dto/update-court.dto';
import { CourtResponseDto } from './dto/court-response.dto';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { QueryCourtDto } from './dto/query-court.dto';
import { GetScheduleDto } from './dto/get-schedule.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courts')
// @Roles(UserRole.ADMIN)
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() createCourtDto: CreateCourtDto,
        @UploadedFile(new FileValidationPipe(false)) image: Express.Multer.File,
    ): Promise<ApiResponseDto<CourtResponseDto>> {
        console.log("xin chào đây là courts controller");
        const court = await this.courtsService.create(createCourtDto, image);

        return new ApiResponseDto(
            'Tạo sân thành công',
            court
        );
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @Body() updateCourtDto: UpdateCourtDto,
        @UploadedFile(new FileValidationPipe(true)) image?: Express.Multer.File,
    ): Promise<ApiResponseDto<CourtResponseDto>> {
        const court = await this.courtsService.update(id, updateCourtDto, image);
        return new ApiResponseDto(
            'Cập nhật sân thành công',
            court
        );
    }

    @Delete(':id')
    async softDelete(@Param('id') id: string): Promise<ApiResponseDto<null>> {
        await this.courtsService.softDelete(id);
        return new ApiResponseDto(
            'Xóa sân thành công'
        );
    }

    @Public()
    @Get()
    async findAll(@Query() query: QueryCourtDto): Promise<ApiResponseDto<PaginatedResponseDto<CourtResponseDto>>> {
        console.log("xin chào đây là courts controller");

        const paginatedCourts = await this.courtsService.findAll(query);
        return new ApiResponseDto(
            'Lấy danh sách sân thành công',
            paginatedCourts
        );
    }

    @Public() 
    @Get(':id/schedule')
    async getSchedule(
        @Param('id') id: string,
        @Query() query: GetScheduleDto,
        @Req() req: any, 
    ): Promise<ApiResponseDto<any>> {

        const userRole = req.user?.role || UserRole.CUSTOMER;

        const scheduleData = await this.courtsService.getSchedule(id, query.date, userRole);

        return new ApiResponseDto(
            'Lấy lịch sân thành công',
            scheduleData
        );
    }
}