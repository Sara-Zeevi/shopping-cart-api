// src/modules/cart/dto/update-cart-item.dto.ts
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0) // Allows quantity 0 for item removal
  quantity: number;
}
