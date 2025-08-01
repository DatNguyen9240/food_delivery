import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { kafka } from '@thirdParty/kafka-client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Ép kiểu trả về để tránh lỗi ESLint
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your_email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your_app_password',
      },
    }) as nodemailer.Transporter;

    // Khởi tạo Kafka consumer để nhận OTP
    this.initKafkaConsumer();
  }

  async initKafkaConsumer() {
    const groupId = process.env.KAFKA_GROUP_ID || 'default-group';
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic: 'send-otp', fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          if (!message.value) return;
          this.logger.log('Received Kafka message:', message.value.toString());
          const { email, otp, user } = JSON.parse(message.value.toString());
          await this.sendOtpEmail(email, otp, user);
        } catch (err) {
          this.logger.error('Kafka message error', err);
        }
      },
    });
    this.logger.log('Kafka consumer for send-otp started');
  }

  async sendOtpEmail(email: string, otp: string, user?: any): Promise<void> {
    try {
      // In giá trị biến môi trường ra console để debug
      console.log('EMAIL_USER:', process.env.EMAIL_USER);
      console.log(
        'EMAIL_PASS:',
        process.env.EMAIL_PASS ? 'Đã có giá trị' : 'Chưa có giá trị',
      );

      if (user) {
        this.logger.log(`User gửi OTP: ${JSON.stringify(user)}`);
      }

      await this.transporter.sendMail({
        from: `EduConnect <${process.env.EMAIL_USER || 'your_email@gmail.com'}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
        html: `<b>Your OTP code is: ${otp}</b>`,
      });

      this.logger.log(`Sent OTP email to ${email}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send OTP email to ${email}`, errorMessage);
      throw new Error(errorMessage);
    }
  }
}
