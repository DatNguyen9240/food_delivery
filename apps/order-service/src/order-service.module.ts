import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '@libs/entities/order.entity';
import { OrderService } from './order-service.service';
import { OrderController } from './order-service.controller';
import { dbConfig } from '@configs/config';
@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TypeOrmModule.forFeature([Order])],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderServiceModule {}
