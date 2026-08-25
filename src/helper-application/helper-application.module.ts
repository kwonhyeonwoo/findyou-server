import { Module } from '@nestjs/common';
import { HelperApplicationService } from './helper-application.service';
import { HelperApplicationController } from './helper-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperApplication } from './entities/helper-application.entity';
import { HelperApplicationRepository } from './helper-application.repository';
import { HelperPostModule } from 'src/helper-post/helper-post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      HelperApplication,
    ]),
    HelperPostModule,
  ],
  controllers: [HelperApplicationController],
  providers: [HelperApplicationService, HelperApplicationRepository],
  exports: [HelperApplicationRepository]
})
export class HelperApplicationModule { }
