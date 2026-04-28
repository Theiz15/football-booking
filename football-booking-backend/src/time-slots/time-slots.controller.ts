import { Controller, Param, Post, Body, UseGuards, Get, Query, Patch } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { TimeSlot } from 'src/entities/time-slot.entity';
import { CreateSlotsDto } from './dto/create-slots.dto';
import { UserRole } from 'src/common/constants/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateCourtDto } from 'src/courts/dto/update-court.dto';

@Controller('courts/:courtId/slots')
export class TimeSlotsController {
    constructor(private readonly timeSlotsService: TimeSlotsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Post()
    async createBulk(
        @Param('courtId') courtId: string,
        @Body() createSlotsDto: CreateSlotsDto,
    ): Promise<ApiResponseDto<TimeSlot[]>> {

        const data = await this.timeSlotsService.createTimeSlots(courtId, createSlotsDto);

        return new ApiResponseDto(
            'Tạo khung giờ thành công',
            data
        );
    }

    @Public()
    @Get()
    async findByCourtDate(
        @Param('courtId') courtId: string,
        @Query('date') date: string,
    ): Promise<ApiResponseDto<TimeSlot[]>> {

        const data = await this.timeSlotsService.findByCourtDate(courtId, date);

        return new ApiResponseDto(
            'Lấy danh sách khung giờ thành công',
            data
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Patch(':slotId')
    async updateSlot(
        @Param('courtId') courtId: string,
        @Param('slotId') slotId: string,
        @Body() updateSlotDto: UpdateCourtDto,
    ): Promise<ApiResponseDto<TimeSlot>> {

        const data = await this.timeSlotsService.updateSlot(courtId, slotId, updateSlotDto);

        return new ApiResponseDto(
            'Cập nhật khung giờ thành công',
            data
        );
    }
}
