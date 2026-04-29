import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsModule } from './courts/courts.module';
import { Booking } from './entities/booking.entity';
import { TimeSlotsModule } from './time-slots/time-slots.module';
import { BookingsModule } from './bookings/bookings.module';
import { RedisModule } from './common/redis/redis.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),
    UsersModule, AuthModule, CourtsModule, TimeSlotsModule, BookingsModule ,RedisModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
