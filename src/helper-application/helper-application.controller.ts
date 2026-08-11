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
  findHistory(
    @GetUser('userId') userId: string
  ) {
    return this.helperApplicationService.findHistory(userId);
  }

  @Get('/received/:id')
  async findReceivedApplications(
    @Param("id") id:string
  ){
    return await this.helperApplicationService.findReceivedApplications(id);
  }

  // 거절
  @Patch('/rejected/:id')
  async rejected(@Param('id') id: string, @GetUser('userId') userId:string){
    await this.helperApplicationService.rejected(id,userId);
    return {
      success:true,
      message:"지원을 거절 하였습니다."
    }
  }

  // 지원신청
  @Post(":id")
  create(
    @Body() body: CreateHelperApplicationDto,
    @GetUser('userId') userId: string,
    @Param('id') helperPostId: string
  ) {
    console.log('bodyt', body);
    return this.helperApplicationService.create(body, userId, helperPostId);
  }
  // 헬퍼 게시글id, 내역id,
  @Patch(":id")
  async accepted(
    @Param('id') id:string,
  ){
    return await this.helperApplicationService.accepted(id);
  }

  @Get(':id')
  findOne(@Param('id') helperId: string) {
    return this.helperApplicationService.findOne(helperId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHelperApplicationDto: UpdateHelperApplicationDto) {
    return this.helperApplicationService.update(+id, updateHelperApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.helperApplicationService.remove(+id);
  }
}
