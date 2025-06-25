// src/modules/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { OrderItemEntity } from './order-item.entity'; 

@Entity('orders') 
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.orders)
  user: UserEntity; 

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  orderDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number; 

  @Column({ default: 'pending' }) 
  status: string;

  @Column({ type: 'datetime2', default: () => 'GETDATE()', onUpdate: 'GETDATE()' }) 
  updatedAt: Date;

  @OneToMany(() => OrderItemEntity, orderItem => orderItem.order, { cascade: true }) 
  orderItems: OrderItemEntity[];
}