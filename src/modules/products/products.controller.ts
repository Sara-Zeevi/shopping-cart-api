// src/modules/products/products.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';


// @ApiTags('products') 
@Controller('categories') 
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {} 

  @Get(':categoryId/products')
  async findProductsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ProductEntity[]> {
    // וודא ש-this.productsService אינו undefined כאן
    const products = await this.productsService.findProductsByCategoryId(categoryId);

    if (!products || products.length === 0) {
      throw new NotFoundException(`No products found for category with ID "${categoryId}" or category does not exist.`);
    }

    return products;
  }
}