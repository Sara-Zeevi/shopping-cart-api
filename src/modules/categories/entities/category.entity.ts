// src/modules/categories/entities/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from '../../products/entities/product.entity'; 

@Entity('categories') 
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string; 

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'datetime2', default: () => 'GETDATE()' })
  createdAt: Date;

  @Column({ type: 'datetime2', default: () => 'GETDATE()', onUpdate: 'GETDATE()' })
  updatedAt: Date;

 
  @OneToMany(() => ProductEntity, product => product.category)
  products: ProductEntity[];
}