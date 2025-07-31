import * as dotenv from 'dotenv';
import * as path from 'path';
import { createClient } from 'redis';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});
