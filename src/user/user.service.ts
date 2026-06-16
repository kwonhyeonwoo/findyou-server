import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }
  async createUser(
    createUserDto: CreateUserDto
  ) {
    return this.userRepository.createUser(createUserDto);
  }
  async findByEmail(email: string) {
    const existEmail = await this.userRepository.findByEmail(email);
    return existEmail;
  };

  async findByNickName(nickName: string) {
    const existNickName = await this.userRepository.findByNickName(nickName)
    return existNickName
  };

  async findByPhone(phone: string) {
    const existPhone = await this.userRepository.findByPhone(phone)
    return existPhone
  };
  async setRefreshToken(refreshToken: string, userId: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateRefreshToken(userId, hashedRefreshToken);
  }
  async removeRefreshToken(userId: string) {
    await this.userRepository.updateRefreshToken(userId, null);
  }
  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    if(!id){
      throw new NotFoundException("회원을 찾을 수 없습니다.")
    }
    return this.userRepository.findByUser(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
