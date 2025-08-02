import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@constants/order-status.enum'; // Tách Enum riêng nếu muốn

@Entity()
export class Order {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 123 })
  @Column()
  userId: number;

  @ApiProperty({ example: 456 })
  @Column()
  restaurantId: number;

  @ApiProperty({ example: 199000 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({ example: 'PENDING', enum: OrderStatus })
  @Column({ type: 'varchar', length: 20 })
  status: OrderStatus;

  @ApiProperty({ example: '2025-08-01T10:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}
