import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ErrandApplicationService } from './errand-application.service';
import { CreateErrandApplicationDto } from './dto/create-errand-application.dto';
import { UpdateErrandApplicationDto } from './dto/update-errand-application.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/common/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('errand-application')
export class ErrandApplicationController {
  constructor(private readonly errandApplicationService: ErrandApplicationService) {}

  @Post()
  create(
    @Body() body: CreateErrandApplicationDto,
    @User('userId') userId:any
  ) {
    console.log('userId',userId);
    return this.errandApplicationService.create(userId,body.errand);
  }

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
