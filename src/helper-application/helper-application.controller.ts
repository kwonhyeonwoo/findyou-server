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
    @Param('id') id: string,
  ) {
    await this.helperApplicationService.accepted(id);
    return {
      success: true,
      message: "수락을 완료 하였습니다."
    }
  }

  @Get(':id')
  findOne(@Param('id') appliId: string) {
    return this.helperApplicationService.findOne(appliId);
  
  }
  @Get('/received/:id')
  async findReceivedApplications(
    @Param("id") id: string
  ) {
    return await this.helperApplicationService.findReceivedApplications(id);
  }

  // 거절
  @Patch('/rejected/:id')
  async rejected(@Param('id') id: string, @GetUser('userId') userId: string) {
    await this.helperApplicationService.rejected(id, userId);
    return {
      success: true,
      message: "지원을 거절 하였습니다."
    }
  }

   // 완료요청
  @Post('/:id/completed-request')
  async completedRequest(
    @Param('id') id:string,
    @GetUser('userId') userId:string
  ){
    await this.helperApplicationService.completedRequest(id,userId);
    return {
      success:true,
      message:"완료 요청을 하였습니다."
    }
  }
 

  // 완료
  @Patch("/:id/completed")
  async completed(@Param('id') id:string,@GetUser('userId') userId:string){
    await this.helperApplicationService.completed(id,userId);
    return{
      success:true,
      message:"승인 요청을 완료 하였습니다."
    }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.helperApplicationService.findOneApplicationWidthClient(id);
  }

  // // 지원내역 삭제
  @Delete(':id')
  async remove(@Param('id') id: string,@GetUser('userId') userId:string) {
    await this.helperApplicationService.remove(id,userId);

    return {
      success: true,
      message: "심부름 지원을 취소 했습니다."
    }
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHelperApplicationDto: UpdateHelperApplicationDto) {
    return this.helperApplicationService.update(+id, updateHelperApplicationDto);
  }

  // 완료요청
  @Post('/:id/completed-request')
  async completedRequest(
    @Param('id') id:string,
    @GetUser('userId') userId:string
  ){
    await this.helperApplicationService.completedRequest(id,userId);
    return {
      success:true,
      message:"완료 요청을 하였습니다."
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.helperApplicationService.remove(+id);
  // }
}
