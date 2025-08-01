import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { kafka } from '@thirdParty/kafka-client';
import { User } from '@libs/entities/user.entity';
import { KafkaOtpPayload } from '@libs/entities/kafka.otp';
@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your_email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_app_password',
      },
    });

    void this.initKafkaConsumer();
  }

  private async initKafkaConsumer(): Promise<void> {
    const groupId = process.env.KAFKA_GROUP_ID || 'default-group';
    const consumer = kafka.consumer({ groupId });

    await consumer.connect();
    await consumer.subscribe({ topic: 'send-otp', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const raw = message.value?.toString();
          if (!raw) return;

          // ✅ Gán đúng kiểu để tránh `any`
          const payload = JSON.parse(raw) as KafkaOtpPayload;
          const { otp, user } = payload;

          await this.sendOtpEmail(user, otp);
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          this.logger.error('Kafka message error', errorMessage);
        }
      },
    });

    this.logger.log('Kafka consumer for send-otp started');
  }

  async sendOtpEmail(user?: User, otp?: string): Promise<void> {
    try {
      if (!user || !user.email) {
        throw new Error('User or user email is missing');
      }
      this.logger.log(`User gửi OTP: ${JSON.stringify(user)}`);

      const from = `EduConnect <${process.env.EMAIL_USER || 'your_email@gmail.com'}>`;

      await this.transporter.sendMail({
        from,
        to: user.email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<b>Your OTP code is: ${otp}</b>`,
      });

      this.logger.log(`Sent OTP email to ${user.email}`);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send OTP email`, errMsg);
      throw new Error(errMsg);
    }
  }
}
