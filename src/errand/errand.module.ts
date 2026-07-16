import { Module } from '@nestjs/common';
import { ErrandService } from './errand.service';
import { ErrandController } from './errand.controller';
import { ErrandRepository } from './errand.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Errand } from './entities/errand.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Errand])
  ],
  controllers: [ErrandController],
  providers: [ErrandService, ErrandRepository],
  exports: [ErrandRepository],
})
export class ErrandModule { }
