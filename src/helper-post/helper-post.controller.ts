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

    // 지원 받은 내역들
    @UseGuards(AuthGuard('jwt'))
    @Get('applications/:id')
    async findWidthApplications(
        @Param('id') id:string
    ){
        await this.helperPostService.findWidthApplications(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(
        @Param('id') id: string,
        @Query('limit') limit?: string,
    ) {
        return await this.helperPostService.findOne(id, limit);
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
