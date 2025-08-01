import { User } from './user.entity';

export interface KafkaOtpPayload {
  email: string;
  otp: string;
  user?: User;
}
