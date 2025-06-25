// src/modules/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryEntity } from '../categories/entities/category.entity';
import { BadRequestException } from '@nestjs/common'; 

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productsRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

 /**
 * Finds all products associated with a given category ID.
 * @param categoryId The category identifier.
 * @returns A Promise for a list of ProductEntity objects.
 */

  async findProductsByCategoryId(categoryId: string): Promise<ProductEntity[]> {
    const numericCategoryId = parseInt(categoryId, 10);
    
    if (isNaN(numericCategoryId)) {
      throw new BadRequestException('Invalid category ID provided. ID must be a number.'); 
    }

    
    const category = await this.categoriesRepository.findOne({ where: { id: numericCategoryId } });
    if (!category) {
      return []; 
    }

    return this.productsRepository.find({ 
      where: { category: { id: numericCategoryId } }, 
      relations: ['category'], 
    });
  }

  //  findOne, create, update ...'.
}