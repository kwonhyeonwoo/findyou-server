import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/common/user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post(':errandId')
  async create(
    @Body() body: CreateReviewDto,
    @Param("errandId") errandId: string,
    @GetUser('userId') userId: string,
  ) {

    await this.reviewService.create(body, userId, errandId);
    return {
      success: true,
      message: '리뷰를 작성하였습니다.'
    }
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
