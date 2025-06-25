// src/modules/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]), 
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  
  exports: [
    TypeOrmModule.forFeature([CategoryEntity]), 
    CategoriesService, 
  ],
})
export class CategoriesModule {}
