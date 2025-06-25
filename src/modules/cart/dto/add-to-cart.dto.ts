// src/modules/cart/dto/add-to-cart.dto.ts
    import { IsNumber, IsNotEmpty, Min } from 'class-validator';

    export class AddToCartDto {
      @IsNumber()
      @IsNotEmpty()
      productId: number; 

      @IsNumber()
      @IsNotEmpty()
      @Min(1) 
      quantity: number;
    }
    