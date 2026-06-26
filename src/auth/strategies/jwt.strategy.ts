// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express'; // 💡 Express의 Request 타입을 가져옵니다.

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // 💡 [수정] 헤더 대신, 커스텀 함수를 통해 요청(Request)의 쿠키에서 토큰을 추출합니다!
      jwtFromRequest: (req: Request) => {
        let token = null;

        // 💡 요청 주머니에 쿠키가 들어있는지 안전하게 파싱해서 확인
        if (req && req.cookies) {
          token = req.cookies['accessToken']; // 백엔드에서 구워준 쿠키 이름과 똑같이!
        }

        return token;
      },
      ignoreExpiration: false,
      secretOrKey: 'MY_REFRESH_SECRET_KEY', // ⚠️ 실무에서는 process.env.JWT_ACCESS_SECRET 형태로 환경변수화 하시는 게 안전합니다!
    });
  }

  async validate(payload: { sub: string, email: string, }) {
    // 💡 토큰 검증이 성공하면 유저 식별 데이터를 리턴 ➡️ 컨트롤러의 req.user로 들어갑니다.
    return { 
      userId: payload.sub, 
      email: payload.email, 
    };
  }
}