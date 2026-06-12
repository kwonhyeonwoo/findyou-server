import { Module } from '@nestjs/common';
import { ErrandService } from './errand.service';
import { ErrandController } from './errand.controller';
import { ErrandRepository } from './errand.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Errand } from './entities/errand.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Errand])
  ],
  controllers: [ErrandController],
  providers: [ErrandService,ErrandRepository],
})
export class ErrandModule {}
