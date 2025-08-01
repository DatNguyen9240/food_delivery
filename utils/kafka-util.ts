import { kafka } from '../third_partys/kafka-client';

export async function sendOtpKafka(email: string, otp: string, user: any) {
  const producer = kafka.producer();
  await producer.connect();
  await producer.send({
    topic: 'send-otp',
    messages: [{ value: JSON.stringify({ email, otp, user }) }],
  });
  await producer.disconnect();
  console.log('[KAFKA] Sent OTP message:', { email, otp });
}
