import { Injectable, NotFoundException } from '@nestjs/common';
import { HelperPostRepository } from './helper-post.repository';
import { CreateHelperPostDto } from './dto/create-helper-post.dto';
import { UpdateHelperPostDto } from './dto/update-helper-post.dto';

@Injectable()
export class HelperPostService {
    constructor(
        private readonly helperPostRepository: HelperPostRepository,
    ) { }
    async create(body: CreateHelperPostDto, userId: string) {
        const newHelper = {
            ...body,
            helper: { id: userId }
        }

        return await this.helperPostRepository.createHelper(newHelper);
    }

    findAll() {
        return this.helperPostRepository.findLists();
    }


    // 내가 올린 헬퍼게시글
    async findMyPosts(userId: string) {
        const applications = await this.helperPostRepository.findMyPosts(userId);
        return applications;
    }

    async findOne(helperId: string, limit?: string) {
        const helper = await this.helperPostRepository.findHelperProfile(helperId, limit);
        if (!helper) {
            throw new NotFoundException('헬퍼가 없습니다.')
        };
        return helper;
    }

    update(id: number, updateHelperDto: UpdateHelperPostDto) {
        return `This action updates a #${id} helper`;
    }

    remove(id: number) {
        return `This action removes 3 #${id} helper`;
    }
}
