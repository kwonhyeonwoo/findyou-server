import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Helper } from './entities/helper.entity';
import { HelperRepository } from './helper.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Helper])
  ],
  controllers: [HelperController],
  providers: [HelperService, HelperRepository],
})
export class HelperModule { }
