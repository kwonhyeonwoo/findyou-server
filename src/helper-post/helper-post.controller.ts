import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/common/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateHelperPostDto } from './dto/create-helper-post.dto';
import { HelperPostService } from './helper-post.service';
import { UpdateHelperPostDto } from './dto/update-helper-post.dto';

@Controller('helper-post')
export class HelperPostController {
    constructor(private readonly helperPostService: HelperPostService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Body() body: CreateHelperPostDto,
        @GetUser('userId') userId: string,

    ) {
        await this.helperPostService.create(body, userId);
        return {
            success: true,
            message: "헬퍼 등록이 완료되었습니다."
        }
    }

    @Get()
    findAll() {
        return this.helperPostService.findAll();
    }

    // 내가 올린 헬퍼게시글
    @UseGuards(AuthGuard('jwt'))
    @Get('my')
    async findMyApplications(
        @GetUser('userId') userId: string
    ) {
        return await this.helperPostService.findMyPosts(userId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Query('limit') limit?: string,
    ) {
        return await this.helperPostService.findOne(id, limit);
    }

    // 완료요청
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/complete-request')
    async completeRequest(
        @Param('id') id: string,
        @GetUser('userId') userId: string,
    ) {
        await this.helperPostService.completeRequest(id, userId);
        return {
            success: true,
            message: "완료 요청을 하였습니다."
        }
    }

    // 완료
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/complete')
    async complete(
        @Param('id') id: string,
        @GetUser('userId') userId: string,
    ) {
        await this.helperPostService.completed(id, userId);
        return {
            success: true,
            message: "완료를 확인 하였습니다."
        }
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateHelperDto: UpdateHelperPostDto) {
        return this.helperPostService.update(+id, updateHelperDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.helperPostService.remove(+id);
    }
}
