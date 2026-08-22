import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './review.repository';
import { ErrandRepository } from 'src/errand/errand.repository';
import { ReviewRole } from './enum/review-role.enum';
import { HelperApplicationRepository } from 'src/helper-application/helper-application.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly errandRepository: ErrandRepository,
    private readonly helperApplicationRepo: HelperApplicationRepository,
  ) { }
  async createErrandReview(body: CreateReviewDto, userId: string, errandApplicationId: string) {
    const errand = await this.errandRepository.findErrandWithApplications(errandApplicationId);
    if (!errand) {
      throw new NotFoundException('심부름을 찾을 수 없습니다.')
    }
    if (errand.user.id !== userId) {
      throw new ForbiddenException('본인 심부름에는 리뷰를 남길 수 없습니다.')
    }
    const isHelper = errand.applications.helper.id === userId; // 헬퍼
    const isRequester = errand.user.id === userId; // 의뢰인
    if (!isHelper && !isRequester) {
      throw new ForbiddenException('해당 리뷰는 당사자만 남길 수 있습니다.')
    }
    const existReview = await this.reviewRepository.existsReview(errandApplicationId, userId);
    if (existReview) {
      throw new BadRequestException('이미 리뷰를 남겼습니다.')
    }

    const role = isHelper ? ReviewRole.HELPER : ReviewRole.USER;
    await this.reviewRepository.createErrandReview({
      rating: body.rating,
      tags: body.tags,
      content: body.content,
      reviewerId: userId,
      revieweeId: errand.applications.helper.id,
      role: role,
      errandApplicationId: errandApplicationId,
    })
  }

  async createHelperReview(body: CreateReviewDto, userId: string, helperApplicationId: string) {
    // const application
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
