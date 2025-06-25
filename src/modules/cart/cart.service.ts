// src/modules/cart/cart.service.ts
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import { CartItemEntity } from './entities/cart-item.entity';
import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartItemRepository: Repository<CartItemEntity>,
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async addProductToCart(userId: string, productId: number, quantity: number): Promise<CartEntity> {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      throw new BadRequestException('Invalid user ID provided. User ID must be a number.');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive number.');
    }

    // Step 1: Find the product
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    if (product.stock < quantity) {
        throw new BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}`);
    }

    // Step 2: Find or create a shopping cart for the user
    let cart = await this.cartRepository.findOne({
      where: { user: { id: numericUserId } },
      relations: ['items', 'items.product'], // Loads cart items and their product details
    });

    if (!cart) {
      const user = await this.userRepository.findOne({ where: { id: numericUserId } });
      if (!user) {
        throw new UnauthorizedException(`User with ID ${userId} not found.`); 
      }
      
      cart = new CartEntity(); 
      cart.user = user;
      cart.items = [];
      cart.totalPrice = 0;
      
      await this.cartRepository.save(cart);
    }

    // Step 3: Check if the product already exists in the cart
    let existingCartItem: CartItemEntity | undefined = cart.items?.find((item) => item.product && item.product.id === productId);

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await this.cartItemRepository.save(existingCartItem);
    } else {
      const newCartItem = this.cartItemRepository.create({
        cart: cart,
        product: product,
        quantity: quantity,
      });
      await this.cartItemRepository.save(newCartItem);
      if (!cart.items) {
        cart.items = [];
      }
      cart.items.push(newCartItem);
    }

    // Step 4: Update product stock
    product.stock -= quantity;
    await this.productRepository.save(product);

    // Step 5: Update the total price of the cart
    cart.totalPrice = (cart.items || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    await this.cartRepository.save(cart);

    return cart;
  }

  // Method to retrieve a shopping cart by user ID
  async getCartByUserId(userId: string): Promise<CartEntity | null> { 
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      throw new BadRequestException('Invalid user ID provided. User ID must be a number.');
    }

    const cart = await this.cartRepository.findOne({
      where: { user: { id: numericUserId } },
      relations: ['items', 'items.product', 'user'],
    });

    return cart;
  }

  // Method: Change quantity of an existing product in the cart
  async updateProductQuantityInCart(userId: string, productId: number, newQuantity: number): Promise<CartEntity> {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      throw new BadRequestException('Invalid user ID provided. User ID must be a number.');
    }

    if (newQuantity < 0) {
      throw new BadRequestException('Quantity cannot be negative. Use 0 to remove item.');
    }

    // Step 1: Find the user's cart
    let cart = await this.cartRepository.findOne({
      where: { user: { id: numericUserId } },
      relations: ['items', 'items.product'], // Load items and products
    });

    if (!cart) {
      throw new NotFoundException(`Cart not found for user ID ${userId}.`);
    }

    // Step 2: Find the specific cart item
    let cartItem = cart.items?.find(item => item.product && item.product.id === productId);

    if (!cartItem) {
      throw new NotFoundException(`Product with ID ${productId} not found in cart.`);
    }

    // Step 3: Adjust product stock before changing quantity
    const oldQuantity = cartItem.quantity;
    const quantityDifference = newQuantity - oldQuantity;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }

    if (quantityDifference > 0) { // If increasing quantity
      if (product.stock < quantityDifference) {
        throw new BadRequestException(`Not enough stock for product ${product.name}. Available: ${product.stock}`);
      }
      product.stock -= quantityDifference; // Decrease stock
    } else if (quantityDifference < 0) { // If decreasing quantity
      product.stock += Math.abs(quantityDifference); // Return to stock
    }
    await this.productRepository.save(product);

    // Step 4: Update the cart item quantity
    cartItem.quantity = newQuantity;

    // Step 5: If the new quantity is 0, remove the item from the cart
    if (newQuantity === 0) {
      await this.cartItemRepository.remove(cartItem);
      cart.items = cart.items.filter(item => item.id !== cartItem?.id);
    } else {
      await this.cartItemRepository.save(cartItem);
    }

    // Step 6: Update the total price of the cart
    cart.totalPrice = (cart.items || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    await this.cartRepository.save(cart);

    // Step 7: Reload the cart to ensure all relations are updated in the response
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product', 'user'],
    });

    if (!updatedCart) {
        throw new InternalServerErrorException('Failed to retrieve updated cart after modification.');
    }

    return updatedCart;
  }

  // Method: Delete a product from the cart
  async removeProductFromCart(userId: string, productId: number): Promise<CartEntity> {
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      throw new BadRequestException('Invalid user ID provided. User ID must be a number.');
    }

    // Step 1: Find the user's cart
    let cart = await this.cartRepository.findOne({
      where: { user: { id: numericUserId } },
      relations: ['items', 'items.product'], // Load items and products
    });

    if (!cart) {
      throw new NotFoundException(`Cart not found for user ID ${userId}.`);
    }

    // Step 2: Find the specific cart item
    const cartItemToRemove = cart.items?.find(item => item.product && item.product.id === productId);

    if (!cartItemToRemove) {
      throw new NotFoundException(`Product with ID ${productId} not found in cart.`);
    }

    // Step 3: Return the quantity to product stock
    const product = await this.productRepository.findOne({ where: { id: cartItemToRemove.product.id } });
    if (product) { // Ensure the product exists before updating stock
      product.stock += cartItemToRemove.quantity;
      await this.productRepository.save(product);
    }

    // Step 4: Delete the cart item
    await this.cartItemRepository.remove(cartItemToRemove);

    // Step 5: Update the items array in the cart locally (to reflect in the response)
    cart.items = cart.items.filter(item => item.id !== cartItemToRemove.id);

    // Step 6: Update the total price of the cart
    cart.totalPrice = (cart.items || []).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    await this.cartRepository.save(cart);

    // Step 7: Reload the cart to ensure all relations are updated in the response
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product', 'user'],
    });

    // Ensure updatedCart is not null/undefined before returning
    if (!updatedCart) {
        throw new InternalServerErrorException('Failed to retrieve updated cart after removal.');
    }

    return updatedCart;
  }
}
