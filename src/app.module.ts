import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres', // 데이터베이스 종류
      host: process.env.DB_HOST, // DB 호스트
      port: +process.env.DB_PORT, // DB 포트
      username: process.env.DB_USERNAME, // DB 사용자 이름
      password: process.env.DB_PASSWORD, // DB 비밀번호
      database: process.env.DB_NAME, // DB 이름
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 경로
      synchronize: process.env.DB_SYNCHRONIZE === 'true', // 스키마 자동 동기화 (운영 환경에서는 false 권장)
      logging: process.env.DB_LOGGING === 'true', // SQL 쿼리 콘솔 출력
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
