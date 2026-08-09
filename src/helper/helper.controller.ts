import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { HelperService } from './helper.service';
import { CreateHelperDto } from './dto/create-helper.dto';
import { UpdateHelperDto } from './dto/update-helper.dto';
import { GetUser } from 'src/auth/common/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('helper')
export class HelperController {
  constructor(private readonly helperService: HelperService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() body: CreateHelperDto,
    @GetUser('userId') userId: string,

  ) {
    await this.helperService.create(body, userId);
    return {
      success: true,
      message: "헬퍼 등록이 완료되었습니다."
    }
  }

  @Get()
  findAll() {
    return this.helperService.findAll();
  }

  // 받은내역
  @UseGuards(AuthGuard('jwt'))
  @Get('applications')
  async findMyApplications(
    @GetUser('userId') userId: string
  ) {
    return await this.helperService.findMyApplications(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return await this.helperService.findOne(id, limit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHelperDto: UpdateHelperDto) {
    return this.helperService.update(+id, updateHelperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.helperService.remove(+id);
  }
}
