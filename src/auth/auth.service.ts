import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) { }

  // 1. ✨ 회원가입
  async create(createAuthDto: CreateUserDto) {
    const { email, nickName, phone, password } = createAuthDto;
    const [existEmail, existNickName, existPhone] = await Promise.all([
      this.userService.findByEmail(email),
      this.userService.findByNickName(nickName),
      this.userService.findByPhone(phone),
    ]);

    if (existEmail) throw new BadRequestException('이미 사용 중인 이메일입니다.');
    if (existNickName) throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    if (existPhone) throw new BadRequestException('이미 등록된 휴대폰 번호입니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser({
      ...createAuthDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginAuthDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('존재하지 않는 이메일입니다.');
    }

    // 유저가 존재할 때 비로소 비밀번호 비교를 수행합니다.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 올바르지 않습니다.');
    }

    const accessToken = this.generateAccessToken(user.id, user.email);
    const refreshToken = this.generateRefreshToken(user.id);

    // DB에 암호화된 리프레시 토큰 저장하기 (이 함수 안에서 비밀번호처럼 bcrypt.hash 돌려서 저장하셔야 안전합니다!)
    await this.userService.setRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  // 3. 🔄 토큰 재발급
  async refresh(refreshToken: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('접근 권한이 없습니다.');
    }

    // 유저가 가져온 쿠키 토큰과 DB에 저장된 암호화 토큰이 일치하는지 비교
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('유효하지 않은 영수증입니다.');
    }

    const newAccessToken = this.generateAccessToken(user.id, user.email,);
    return { accessToken: newAccessToken };
  }

  // 💡 [매우 중요] 가드(JwtStrategy)가 'MY_REFRESH_SECRET_KEY'를 쓰고 있으므로 
  // 발급할 때 비밀번호 열쇠도 일단 동일하게 맞춰줍니다. (나중에 환경변수 배포 시 분리하는 걸 추천합니다)
  generateAccessToken(userId: string, email: string, ): string {
    return this.jwtService.sign(
      { email, sub: userId, },
      { secret: 'MY_REFRESH_SECRET_KEY', expiresIn: '10m' } // 👈 아까 401 범인이었던 열쇠 일치시킴!
    );
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign(
      { sub: userId },
      { secret: 'MY_REFRESH_SECRET_KEY', expiresIn: '14d' }
    );
  }
}