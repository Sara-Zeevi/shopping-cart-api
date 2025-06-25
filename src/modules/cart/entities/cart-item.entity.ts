// src/modules/cart/entities/cart-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, product => product.cartItems, { eager: true, nullable: false }) // יחס N:1 עם ProductEntity
  product: ProductEntity;

  @ManyToOne(() => CartEntity, cart => cart.items, { onDelete: 'CASCADE', nullable: false }) // יחס N:1 עם CartEntity
  cart: CartEntity;

  @Column({ type: 'int', default: 1, nullable: false })
  quantity: number;

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ type: 'datetime2', default: () => 'GETDATE()', onUpdate: 'GETDATE()' })
  updatedAt: Date;
}