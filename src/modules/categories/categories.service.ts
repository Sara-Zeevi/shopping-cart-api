// src/modules/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoriesRepository.find();
  }


  async findOneById(id: number): Promise<CategoryEntity | null> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async create(name: string, description?: string): Promise<CategoryEntity> {
    const newCategory = this.categoriesRepository.create({ name, description });
    return this.categoriesRepository.save(newCategory);
  }
}