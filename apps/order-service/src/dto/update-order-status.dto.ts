import { OrderStatus } from '@constants/order-status.enum';

export class UpdateOrderStatusDto {
  status: OrderStatus;
}
