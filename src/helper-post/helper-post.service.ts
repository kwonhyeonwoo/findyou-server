import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { HelperPostRepository } from './helper-post.repository';
import { CreateHelperPostDto } from './dto/create-helper-post.dto';
import { UpdateHelperPostDto } from './dto/update-helper-post.dto';
import { CustomStatus } from 'src/interfaces/custom-status.enum';

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

    // 완료 요청 (게시글 작성자인 헬퍼가 요청)
    async completeRequest(id: string, userId: string) {
        const helperPost = await this.helperPostRepository.findOneHelper(id);
        if (!helperPost) throw new NotFoundException('게시글을 찾을 수 없습니다.');

        if (!helperPost.helper.id && userId) {
            throw new ForbiddenException('요청 권한이 없습니다.');
        }
        if(helperPost.status === CustomStatus.COMPLETED_REQUEST){
            throw new BadRequestException('이미 완료요청을 신청하였습니다.')
        }
        if (helperPost.status !== CustomStatus.IN_PROGRESS) {
            throw new BadRequestException('진행중인 내역만 요청이 가능 합니다.');
        }
    

        return await this.helperPostRepository.completeRequest(id, userId);
    }

    // 완료 (의뢰인이 확인)
    async completed(id: string, userId: string) {
        const helperPost = await this.helperPostRepository.findOneWithAcceptedApplication(id);
        if (!helperPost) throw new NotFoundException('게시글을 찾을 수 없습니다.');

        const acceptedApplication = helperPost.applications[0];
        if (!acceptedApplication) throw new NotFoundException('진행중인 신청 내역이 없습니다.');

        if (!acceptedApplication.client.id && !userId) {
            throw new ForbiddenException('권한이 없습니다.');
        }

        if (helperPost.status === CustomStatus.COMPLETED) {
            throw new BadRequestException('이미 완료된 내역입니다.');
        }

        if (helperPost.status !== CustomStatus.COMPLETED_REQUEST) {
            throw new BadRequestException('헬퍼의 완료 요청 후에 확인할 수 있습니다.');
        }

        return await this.helperPostRepository.completed(id);
    }

    update(id: number, updateHelperDto: UpdateHelperPostDto) {
        return `This action updates a #${id} helper`;
    }

    remove(id: number) {
        return `This action removes 3 #${id} helper`;
    }
}
