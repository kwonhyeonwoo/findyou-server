import { Module } from '@nestjs/common';
import { ErrandApplicationService } from './errand-application.service';
import { ErrandApplicationController } from './errand-application.controller';
import { ErrandApplicationRepository } from './errand-application.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrandApplication } from './entities/errand-application.entity';
import { ErrandModule } from 'src/errand/errand.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ErrandApplication,
    ]),
    ErrandModule,
  ],
  controllers: [ErrandApplicationController],
  providers: [ErrandApplicationService, ErrandApplicationRepository],
})
export class ErrandApplicationModule { }
