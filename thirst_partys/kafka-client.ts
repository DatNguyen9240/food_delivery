import * as dotenv from 'dotenv';
import * as path from 'path';
import { Kafka } from 'kafkajs';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const kafka = new Kafka({
  brokers: (process.env.KAFKA_BROKER || '').split(','),
  clientId: process.env.KAFKA_CLIENT_ID,
});

export const kafkaGroupId = process.env.KAFKA_GROUP_ID;
