 // src/modules/cart/cart.module.ts
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { CartController } from './cart.controller';
    import { CartService } from './cart.service';
    import { CartEntity } from './entities/cart.entity';
    import { CartItemEntity } from './entities/cart-item.entity';
    import { ProductEntity } from '../products/entities/product.entity'; 
    import { UserEntity } from '../users/entities/user.entity';
    import { ProductsModule } from '../products/products.module'; 
    import { UsersModule } from '../users/users.module'; 

    @Module({
      imports: [
        TypeOrmModule.forFeature([CartEntity, CartItemEntity, ProductEntity, UserEntity]), 
        ProductsModule, 
        UsersModule,
      ],
      controllers: [CartController],
      providers: [CartService],
      exports: [CartService], 
    })
    export class CartModule {}
    