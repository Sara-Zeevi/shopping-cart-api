import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto'; 
import { LoginUserDto } from './dto/login-user.dto';  
import { UserEntity } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {
 constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity) 
    private usersRepository: Repository<UserEntity>,
) {}

  /**
 * Method for new user registration.
 * Receives a registration DTO, hashes the password, and saves the new user.
 */
  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const { username, email, password } = registerUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashedPassword, 
    });

    await this.usersRepository.save(newUser);

    const { password: _, ...result } = newUser;
    return { message: 'User registered successfully', user: result };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { username, password } = loginUserDto;

   
    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username, email: user.email }; 
    const access_token = this.jwtService.sign(payload); 

    return { access_token };
  }
}