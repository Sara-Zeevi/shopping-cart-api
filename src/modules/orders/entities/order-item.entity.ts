// order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity()
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, order => order.orderItems)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, product => product.orderItems)
  product: ProductEntity;

  @Column()
  quantity: number; 

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtOrder: number;
}