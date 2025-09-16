import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { BookingService } from './booking.service';

@Injectable()
export class BookingConsumer implements OnModuleInit {
  private consumer: Consumer;
  private readonly logger = new Logger(BookingConsumer.name);

  constructor(private readonly bookingService: BookingService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'booking-service',
      brokers: ['localhost:9092'],
    });

    this.consumer = kafka.consumer({ groupId: 'booking-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'booking.created' });

    this.logger.log('Kafka consumer connected and subscribed to booking.created');

    await this.consumer.run({
      eachMessage: async ({ message, topic }) => {
        try {
          if (!message.value) {
            this.logger.log('Received message without value');
            return;
          }

          this.logger.log(`parsing client booking`);

          const data = JSON.parse(message.value.toString());

          this.logger.debug(`Received booking created event: ${JSON.stringify(data)}`);

          await this.bookingService.checkBooking(data.bookingId);

          this.logger.log(`Booking ${data.bookingId} CHECKING_AVAILABILITY`);

          //супер простая логика, бизнес-логику уже нужно уточнять детали при разработке

          if (data.guests <= 6) {
            await this.bookingService.confirmBooking(data.bookingId);
            this.logger.log(`Booking ${data.bookingId} confirmed`);
          } else {
            await this.bookingService.rejectBooking(data.bookingId);
            this.logger.log(`Booking ${data.bookingId} rejected`);
          }
        } catch (e) {
          this.logger.debug(e);
        }
      },
    });
  }
}
