// src/modules/products/products.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]), 
    CategoriesModule, 
  ],
  controllers: [ProductsController], 
  providers: [ProductsService], 
  exports: [ProductsService],
})
export class ProductsModule {}
