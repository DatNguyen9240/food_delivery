import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '@libs/entities/order.entity'; // Adjust the import path as necessary
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from 'constants/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create({
      ...dto,
      status: dto.status,
    });
    return this.orderRepo.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  findOne(id: number): Promise<Order | null> {
    return this.orderRepo.findOneBy({ id });
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) throw new Error('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }
}
