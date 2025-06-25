// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserEntity } from './modules/users/entities/user.entity';
import { ProductEntity } from './modules/products/entities/product.entity';
import { CategoryEntity } from './modules/categories/entities/category.entity';
import { CartEntity } from './modules/cart/entities/cart.entity';
import { CartItemEntity } from './modules/cart/entities/cart-item.entity';

import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module'; 
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    //  טעינת משתני סביבה (ENV)
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),

    //  הגדרת חיבור למסד נתונים עם TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const trustServerCertificate = 
          configService.get<string>('DB_TRUSTED_CONNECTION')?.toLowerCase() === 'true';

        return {
          type: 'mssql',

          host: configService.get<string>('DB_SERVER'),
          database: configService.get<string>('DB_DATABASE'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          port: parseInt(configService.get<string>('DB_PORT') || '1433', 10), 

          options: {
            encrypt: true, 
            trustServerCertificate: trustServerCertificate,
          },
          
          entities: [
              UserEntity,
              CategoryEntity,
              ProductEntity,
              CartEntity,
              CartItemEntity,
            ],
          
          synchronize: configService.get<boolean>('DB_SYNCHRONIZE') || false, 
        };
      },
    }),

    AuthModule,
    UsersModule, 
    CategoriesModule,
    CartModule,
    ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
