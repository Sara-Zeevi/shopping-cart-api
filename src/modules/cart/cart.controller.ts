// src/modules/cart/cart.controller.ts
import { Controller, Post, Body, Req, UseGuards, HttpException, HttpStatus, Get, Param, Patch, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CartEntity } from './entities/cart.entity';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addProductToCart(
    @Body() addToCartDto: AddToCartDto,
    @Req() req
  ): Promise<{ message: string; cart: CartEntity }> {
    const userId = req.user?.id?.toString(); 

    if (!userId) {
      throw new HttpException('User ID not found in request.', HttpStatus.UNAUTHORIZED);
    }

    try {
      const updatedCart = await this.cartService.addProductToCart(
        userId,
        addToCartDto.productId,
        addToCartDto.quantity
      );
      return { message: 'Product added to cart successfully!', cart: updatedCart };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to add product to cart.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyCart(@Req() req): Promise<CartEntity> {
    const userId = req.user?.id?.toString();

    if (!userId) {
      throw new HttpException('User ID not found in request.', HttpStatus.UNAUTHORIZED);
    }

    try {
      const cart = await this.cartService.getCartByUserId(userId);
      if (!cart) {
        throw new NotFoundException(`No cart found for user ID ${userId}.`);
      }
      return cart;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to retrieve cart.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-quantity')
  async updateProductQuantityInCart(
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Req() req
  ): Promise<{ message: string; cart: CartEntity }> {
    const userId = req.user?.id?.toString();

    if (!userId) {
      throw new HttpException('User ID not found in request.', HttpStatus.UNAUTHORIZED);
    }

    try {
      const updatedCart = await this.cartService.updateProductQuantityInCart(
        userId,
        updateCartItemDto.productId,
        updateCartItemDto.quantity
      );
      return { message: 'Product quantity updated in cart successfully!', cart: updatedCart };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update product quantity in cart.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Endpoint for deleting a product from the cart
  // HTTP Method: DELETE
  // URL: {{baseUrl}}/cart/remove/:productId
  // Requires JWT authentication
  @UseGuards(JwtAuthGuard)
  @Delete('remove/:productId')
  async removeProductFromCart(
    @Param('productId') productId: string,
    @Req() req
  ): Promise<{ message: string; cart: CartEntity }> {
    const userId = req.user?.id?.toString();

    if (!userId) {
      throw new HttpException('User ID not found in request.', HttpStatus.UNAUTHORIZED);
    }

    try {
      const numericProductId = parseInt(productId, 10);
      if (isNaN(numericProductId)) {
        throw new BadRequestException('Invalid product ID provided. Product ID must be a number.');
      }

      const updatedCart = await this.cartService.removeProductFromCart(
        userId,
        numericProductId
      );
      return { message: 'Product removed from cart successfully!', cart: updatedCart };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to remove product from cart.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
