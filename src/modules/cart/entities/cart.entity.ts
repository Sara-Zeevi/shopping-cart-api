// src/modules/cart/entities/cart.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CartItemEntity } from './cart-item.entity';

@Entity('carts') 
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, user => user.cart)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => CartItemEntity, cartItem => cartItem.cart, { cascade: true, eager: true }) // יחס 1:N עם CartItemEntity
  items: CartItemEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ type: 'datetime2', default: () => 'GETDATE()', onUpdate: 'GETDATE()' })
  updatedAt: Date;
}