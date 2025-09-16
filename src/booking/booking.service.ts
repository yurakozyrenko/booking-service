import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entity/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async confirmBooking(id: string) {
    await this.bookingRepo.update(id, { status: BookingStatus.CONFIRMED });
  }

  async rejectBooking(id: string) {
    await this.bookingRepo.update(id, { status: BookingStatus.REJECTED });
  }

    async checkBooking(id: string) {
    await this.bookingRepo.update(id, { status: BookingStatus.CHECKING_AVAILABILITY });
  }
}
