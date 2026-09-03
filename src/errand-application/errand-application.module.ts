import { Module } from '@nestjs/common';
import { ErrandApplicationService } from './errand-application.service';
import { ErrandApplicationController } from './errand-application.controller';
import { ErrandApplicationRepository } from './errand-application.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrandApplication } from './entities/errand-application.entity';
import { ErrandModule } from 'src/errand/errand.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ErrandApplication,
    ]),
    ErrandModule,
    UserModule,
  ],
  controllers: [ErrandApplicationController],
  providers: [ErrandApplicationService, ErrandApplicationRepository],
})
export class ErrandApplicationModule { }
