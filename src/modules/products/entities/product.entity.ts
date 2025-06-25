// src/catalog/product/product.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { CartItemEntity } from '../../cart/entities/cart-item.entity'; 

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ default: 0 })
  stock: number; 

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ type: 'datetime2', default: () => 'GETDATE()', onUpdate: 'CURRENT_datetime2' })
  updatedAt: Date;

  @Column({ type: 'nvarchar', length: 'max', nullable: true }) 
  imageUrl: string;
 
  @ManyToOne(() => CategoryEntity, category => category.products, { eager: true, onDelete: 'SET NULL' })
  category: CategoryEntity;

 
  @OneToMany(() => CartItemEntity, cartItem => cartItem.product)
  cartItems: CartItemEntity[];
  static cartItems: any;
    orderItems: any;
}