import { Controller, Get, Post, Body,  Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('signin')
  async login(@Body() loginDto: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // HTTPS 환경에서는 true
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    return { accessToken };
  }
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('영수증이 없습니다.');

    // 쿠키에 있던 토큰을 까서 유저 ID(sub)를 알아냄
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: 'MY_REFRESH_SECRET_KEY' });
      return this.authService.refresh(refreshToken, payload.sub);
    } catch {
      throw new UnauthorizedException('만료되거나 잘못된 영수증입니다.');
    }
  }

  // 3. 🌟 실시간 인증용 API (프론트가 나 누구냐고 물어볼 때 쓰는 곳)
  @UseGuards(AuthGuard('jwt')) // 🛡️ 문지기 출격
  @Get('me')
  getProfile(@Req() req: any) {
    // 문지기를 통과하면 유저 정보(userId, email)가 여기에 들어있음!
    return { ok: true, user: req.user };
  }
}
