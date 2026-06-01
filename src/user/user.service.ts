import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }
  async create(createUserDto: CreateUserDto) {
    const { email, nickName, phone, password } = createUserDto;
    const [existEmail, existNickName, existPhone] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByNickName(nickName),
      this.userRepository.findByPhone(phone),
    ]);
  
    if (existEmail) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }
    if (existNickName) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    }
    if (existPhone) {
      throw new BadRequestException('이미 등록된 휴대폰 번호입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
