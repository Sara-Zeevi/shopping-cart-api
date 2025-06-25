// src/modules/categories/categories.controller.ts
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport'; 
import { CategoryEntity } from './entities/category.entity';

@Controller('categories') 
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthGuard('jwt')) 
  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createCategory(@Body() createCategoryDto: { name: string; description?: string }): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto.name, createCategoryDto.description);
  }
}