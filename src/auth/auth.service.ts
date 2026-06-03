import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService:UserService,
    private jwtService: JwtService,
  ){}
  async create(createAuthDto: CreateAuthDto) {
    const { email, nickName, phone, password } = createAuthDto;
    const [existEmail, existNickName, existPhone] = await Promise.all([
      this.userService.findByEmail(email),
      this.userService.findByNickName(nickName),
      this.userService.findByPhone(phone),
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
    return this.userService.createUser({
      ...createAuthDto,
      password: hashedPassword,
    });
  }

  async login(loginDto:LoginAuthDto){
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    const isPasswordValid= await bcrypt.compare(password,user.password)
    if(!user.email){
      throw new BadRequestException('존재하지 않은 이메일 입니다.')
    }
    if(!isPasswordValid){
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.')
    };

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);
    await this.userService.setRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('접근 권한이 없습니다.');
    }

    // 🌟 [핵심] 유저가 가져온 쿠키 토큰과 DB에 저장된 암호화 토큰이 일치하는지 비교!
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    
    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('유효하지 않은 영수증입니다.');
    }

    // 다 맞으면 새 팔찌(Access Token)만 새로 끊어주기
    const newAccessToken = this.generateAccessToken(user.id, user.email);
    return { accessToken: newAccessToken };
  }
  generateAccessToken(userId: string, email: string): string {
    return this.jwtService.sign({ email, sub: userId }, { secret: 'MY_ACCESS_SECRET_KEY', expiresIn: '10s' });
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign({ sub: userId }, { secret: 'MY_REFRESH_SECRET_KEY', expiresIn: '14d' });
  }
}
