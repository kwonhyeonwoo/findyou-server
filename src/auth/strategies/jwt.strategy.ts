// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더에서 팔찌 꺼내기
      ignoreExpiration: false,
      secretOrKey: 'MY_ACCESS_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    // 팔찌가 진짜면 유저 ID와 이메일을 리턴 ➡️ 컨트롤러의 req.user에 들어감
    return { userId: payload.sub, email: payload.email };
  }
}