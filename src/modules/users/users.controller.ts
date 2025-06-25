// src/modules/users/users.controller.ts
import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() 
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id') id: string): Promise<UserEntity | null> { 
    return this.usersService.findOne(+id); 
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

}