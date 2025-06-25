// src/modules/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { CartEntity } from '../../cart/entities/cart.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ type: 'datetime2', default: () => 'GETDATE()', onUpdate: 'GETDATE()' }) 
  updatedAt: Date;

 
  @OneToOne(() => CartEntity, cart => cart.user)
  @JoinColumn()
  cart: CartEntity;
    orders: any;
}