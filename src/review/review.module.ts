import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRepository } from './review.repository';
import { Errand } from 'src/errand/entities/errand.entity';
import { ErrandModule } from 'src/errand/errand.module';
import { HelperApplicationModule } from 'src/helper-application/helper-application.module';
import { ErrandApplicationModule } from 'src/errand-application/errand-application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    ErrandModule,
    HelperApplicationModule,
    ErrandApplicationModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository,],
})
export class ReviewModule { }
