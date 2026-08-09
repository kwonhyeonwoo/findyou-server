import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ErrandModule } from './errand/errand.module';
import { User } from './user/entities/user.entity';
import { Errand } from './errand/entities/errand.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ErrandApplicationModule } from './errand-application/errand-application.module';
import { ErrandApplication } from './errand-application/entities/errand-application.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';
import { HelperPost } from './helper-post/entities/helper-post.entity';
import { HelperApplicationModule } from './helper-application/helper-application.module';
import { HelperApplication } from './helper-application/entities/helper-application.entity';
import { HelperPostModule } from './helper-post/helper-post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ServeStaticModule.forRoot({
      // 서빙할 실제 폴더 경로 (프로젝트 루트의 uploads 폴더)
      rootPath: join(__dirname, '..', 'uploads'),

      // 프론트엔드에서 접근할 URL의 접두사 (이걸 설정해야 localhost:8000/uploads/... 로 접근 가능)
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // 데이터베이스 종류
        host: configService.get('DB_HOST'), // DB 호스트
        port: +configService.get('DB_PORT'), // DB 포트
        username: configService.get('DB_USERNAME'), // DB 사용자 이름
        password: configService.get('DB_PASSWORD'), // DB 비밀번호
        database: configService.get('DB_NAME'), // DB 이름
        entities: [User, Errand, ErrandApplication, Review, HelperPost, HelperApplication], // 엔티티 경로
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true', // 스키마 자동 동기화 (운영 환경에서는 false 권장)
        logging: configService.get('DB_LOGGING') === 'true', // SQL 쿼리 콘솔 출력
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ErrandModule,
    ErrandApplicationModule,
    ReviewModule,
    HelperPostModule,
    HelperApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
