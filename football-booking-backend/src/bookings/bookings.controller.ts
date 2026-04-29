import { Controller, Post, Req, UseGuards ,Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiResponseDto } from 'src/common/dto/api-response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/common/constants/enums';
import { HoldSlotDto } from './dto/hold-slot.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';


@UseGuards(JwtAuthGuard , RolesGuard) 
@Controller('bookings')
export class BookingsController {
    constructor( private readonly bookingsService: BookingsService) { }

    @Post('admin')
    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    async createBooking(
        @Body() createBookingDto: CreateBookingDto,
        @Req() req: any
    ):Promise<ApiResponseDto<any>> {
        const user = req.user;

        const booking = await this.bookingsService.createBooking(createBookingDto, user);
        return new ApiResponseDto('Đặt sân thành công', booking);
    }

    @Post('hold')
    async holdSlot(@Body() rq: HoldSlotDto, @Req() req: any): Promise<ApiResponseDto<any>> {
        const user = req.user;
        await this.bookingsService.holdSlot(rq.timeSlotId, user.id);
        return new ApiResponseDto('Giữ chỗ thành công');
    }

    @Post('confirm')
    async confirmBooking(@Body() rq: ConfirmBookingDto, @Req() req: any): Promise<ApiResponseDto<any>> {
        const user = req.user;
        const booking = await this.bookingsService.confirmBooking(rq.timeSlotId, user);
        return new ApiResponseDto('Xác nhận đặt sân thành công', booking);
    }

}   
