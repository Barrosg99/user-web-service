import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggedUserDto, LoggedUserResponse } from './dto/logged-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async login(login: LoggedUserDto): Promise<LoggedUserResponse> {
    // testar mutation de login
    const user = await this.userModel.findOne(login);

    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const payload = { username: user.email, id: user.id };
    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }
}
