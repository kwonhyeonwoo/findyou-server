// src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user; // 💡 Passport가 토큰 풀어서 넣어준 유저 객체

  // @User('id') 처럼 특정 키값만 요청하면 그 값만 주고, 없으면 객체 통째로 리턴
  return data ? user?.[data] : user;
});