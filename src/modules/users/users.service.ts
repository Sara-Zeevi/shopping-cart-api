// users.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  findAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  create(createUserDto: CreateUserDto): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: number): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

 async findUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.userRepository.create(userData);
    return this.userRepository.save(newUser);
  }

}