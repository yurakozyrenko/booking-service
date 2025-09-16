import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Booking } from './entity/booking.entity';
import { BookingService } from './booking.service';
import { BookingConsumer } from './booking.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingService, BookingConsumer],
})
export class BookingModule {}
