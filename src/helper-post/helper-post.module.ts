import { Module } from '@nestjs/common';
import { HelperPostService } from './helper-post.service';
import { HelperPostController } from './helper-post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelperPost } from './entities/helper-post.entity';
import { HelperPostRepository } from './helper-post.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([HelperPost])
    ],
    controllers: [HelperPostController],
    exports: [HelperPostRepository],
    providers: [HelperPostService, HelperPostRepository],
})
export class HelperPostModule { }
