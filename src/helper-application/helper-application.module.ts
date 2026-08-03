import { Module } from '@nestjs/common';
import { HelperApplicationService } from './helper-application.service';
import { HelperApplicationController } from './helper-application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperApplication } from './entities/helper-application.entity';
import { HelperApplicationRepository } from './helper-application.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      HelperApplication,
    ])
  ],
  controllers: [HelperApplicationController],
  providers: [HelperApplicationService,HelperApplicationRepository],
})
export class HelperApplicationModule {}
