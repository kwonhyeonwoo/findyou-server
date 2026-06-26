import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ErrandApplicationService } from './errand-application.service';
import { CreateErrandApplicationDto } from './dto/create-errand-application.dto';
import { UpdateErrandApplicationDto } from './dto/update-errand-application.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/common/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('errand-application')
export class ErrandApplicationController {
  constructor(private readonly errandApplicationService: ErrandApplicationService) {}

  @Post(":id")
  async create(
    @Param('id') id:string,
    @GetUser('userId') userId:any
  ) {
    console.log('errandid',id)
    await this.errandApplicationService.create(userId,id);
    return {
      success:true,
      message:"심부름을 신청하였습니다."
    }
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.errandApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.errandApplicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateErrandApplicationDto: UpdateErrandApplicationDto) {
    return this.errandApplicationService.update(+id, updateErrandApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.errandApplicationService.remove(+id);
  }
}
