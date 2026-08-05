import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HelperApplicationService } from './helper-application.service';
import { CreateHelperApplicationDto } from './dto/create-helper-application.dto';
import { UpdateHelperApplicationDto } from './dto/update-helper-application.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/common/user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('helper-application')
export class HelperApplicationController {
  constructor(private readonly helperApplicationService: HelperApplicationService) { }

  @Post(":id")
  create(
    @Body() body: CreateHelperApplicationDto,
    @GetUser('userId') userId: string,
    @Param('id') helperPostId: string
  ) {
    console.log('bodyt', body);
    return this.helperApplicationService.create(body, userId, helperPostId);
  }

  @Get()
  findAll(
    @GetUser('userId') userId:string
  ) {
    return this.helperApplicationService.findAll(userId);
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
