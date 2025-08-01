import { OrderStatus } from '@constants/order-status.enum';
import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({ example: 1 })
  userId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ example: 123 })
  restaurantId: number;

  @IsPositive()
  @ApiProperty({ example: 199000 })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ example: 'PENDING', enum: OrderStatus })
  status: OrderStatus;
}
