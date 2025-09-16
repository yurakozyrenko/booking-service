import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [process.env.KAFKA_EVENTS_BROKERS || 'localhost:9092'] },
      consumer: { groupId: process.env.GROUP_ID || 'booking-service-consumer' },
    },
  });

  await app.listen();
  console.log(`Booking Service Kafka consumer started`);
}
bootstrap();
