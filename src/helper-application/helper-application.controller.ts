import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { HelperApplicationService } from './helper-application.service';
import { CreateHelperApplicationDto } from './dto/create-helper-application.dto';
import { UpdateHelperApplicationDto } from './dto/update-helper-application.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/common/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('helper-application')
export class HelperApplicationController {
  constructor(private readonly helperApplicationService: HelperApplicationService) { }

  // 지원내역
  @Get()
  getMyApplications(
    @GetUser('userId') userId: string
  ) {
    return this.helperApplicationService.getClientDetailApplications(userId);
  }

  @Get("id")
  async getDetailApplication(@Param('id') id:string){
    return this.helperApplicationService.getDetailApplication(id)
  }

  @Post(":id")
  async create(
    @Body() body: CreateHelperApplicationDto,
    @GetUser('userId') userId: string,
    @Param('id') helperPostId: string
  ) {
    await this.helperApplicationService.create(body, userId, helperPostId);
    return {
      success: true,
      message: "헬퍼게시글에 지원을 하였습니다."
    }

  }
  // 헬퍼 게시글id, 내역id,
  @Patch(":id")
  async accepted(
    @Param('id') id: string,
  ) {
    await this.helperApplicationService.accepted(id);
    return {
      success: true,
      message: "수락을 완료 하였습니다."
    }
  }

  // @Get(':id')
  // findOne(@Param('id') appliId: string) {
  //   return this.helperApplicationService.findOne(appliId);
  // }
  // @Get('/received/:id')
  // async findReceivedApplications(
  //   @Param("id") id: string
  // ) {
  //   return await this.helperApplicationService.findReceivedApplications(id);
  // }

  // 거절
  @Patch('/rejected/:id')
  async rejected(@Param('id') id: string, @GetUser('userId') userId: string) {
    await this.helperApplicationService.rejected(id, userId);
    return {
      success: true,
      message: "지원을 거절 하였습니다."
    }
  }

  // 지원내역 삭제
  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser('userId') userId: string) {
    await this.helperApplicationService.remove(id, userId);

    return {
      success: true,
      message: "심부름 지원을 취소 했습니다."
    }
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHelperApplicationDto: UpdateHelperApplicationDto) {
    return this.helperApplicationService.update(+id, updateHelperApplicationDto);
  }
}
