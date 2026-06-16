import { Controller, Get, Post, Body, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
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
  ) { }

  @Post('signup')
  async create(@Body() body: CreateAuthDto) {
    console.log('first')
    const newUser = await this.authService.create(body);
    if (!newUser) {
      return {
        success: false,
        message: '회원가입에 실패하였습니다.',
      }
    }
    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
    }
  }

  // 1. 🔑 로그인 (Sign-in)
  @Post('signin')
  async login(@Body() body: LoginAuthDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(body);

    const isProd = process.env.NODE_ENV === 'production';

    // 💡 Access Token도 쿠키로 일관되게 구워줍니다.
    res.cookie('accessToken', accessToken, {
      httpOnly: false, // 프론트에서 JS로 유저 체크용 등으로 쓸 수 있게 (보안 가이드에 따라 true도 가능)
      secure: isProd,
      sameSite: 'lax',
      maxAge: 30 * 60 * 1000, // 30분
    });

    // 💡 Refresh Token 쿠키 설정
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // XSS 공격 방지를 위해 리프레시는 반드시 true
      secure: isProd,
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
    });

    // 프론트엔드 바디에는 성공 메시지만 깔끔하게 반환합니다.
    return {
      success: true,
      message: "로그인을 하였습니다.",
    };
  }

  // 2. 🔄 토큰 재발급 (Refresh)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('영수증(리프레시 토큰)이 없습니다.');

    try {
      // 리프레시 토큰 검증
      const payload = this.jwtService.verify(refreshToken, { secret: 'MY_REFRESH_SECRET_KEY' });

      // 서비스에서 새로운 Access Token 받아오기
      const { accessToken } = await this.authService.refresh(refreshToken, payload.sub);

      const isProd = process.env.NODE_ENV === 'production';

      // 💡 [수정] signin과 똑같은 'accessToken' 쿠키 명칭으로 다시 구워줍니다.
      response.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 30 * 60 * 1000, // 30분
      });

      return { success: true };
    } catch {
      throw new UnauthorizedException('만료되거나 잘못된 영수증입니다.');
    }
  }

  // 3. 🌟 실시간 인증용 API
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: any) {
    return { ok: true, user: req.user };
  }
}