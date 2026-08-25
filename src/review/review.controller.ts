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
  @Post(':errandApplicationId/errand')
  async createErrandReview(
    @Body() body: CreateReviewDto,
    @Param("errandApplicationId") errandApplicationId: string,
    @GetUser('userId') userId: string,
  ) {

    await this.reviewService.createErrandReview(body, userId, errandApplicationId);
    return {
      success: true,
      message: '리뷰를 작성하였습니다.'
    }
  };

  @UseGuards(AuthGuard('jwt'))
  @Post(':helperApplicationId/helper-post')
  async createHelperReview(
    @Body() body: CreateReviewDto,
    @Param('helperApplicationId') helperApplicationId: string,
    @GetUser('userId') userId: string
  ) {
    await this.reviewService.createHelperReview(body, userId, helperApplicationId)
    return {
      success: true,
      message: "리뷰를 작성하였습니다."
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
