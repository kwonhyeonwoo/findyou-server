import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './review.repository';
import { ErrandRepository } from 'src/errand/errand.repository';
import { ReviewRole } from './enum/review-role.enum';
import { HelperApplicationRepository } from 'src/helper-application/helper-application.repository';
import { ErrandApplicationRepository } from 'src/errand-application/errand-application.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly errandRepository: ErrandRepository,
    private readonly errandApplicationRepo: ErrandApplicationRepository,
    private readonly helperApplicationRepo: HelperApplicationRepository,
  ) { }

  // role -> 리뷰받는 대상자로 구분, client면 helper, helper이면 client
  async createErrandReview(body: CreateReviewDto, userId: string, errandApplicationId: string) {
    const errandApplication = await this.errandApplicationRepo.findByIdErrandWithHelper(errandApplicationId);
    const role = errandApplication.helper.id === userId ? ReviewRole.CLIENT : ReviewRole.HELPER;
    console.log('role:', role)
    await this.reviewRepository.createErrandReview({
      rating: body.rating,
      tags: body.tags,
      content: body.content,
      reviewerId: userId,
      revieweeId: role === ReviewRole.CLIENT ? errandApplication.errand.user.id : errandApplication.helper.id,
      role,
      errandApplicationId,
    })
  }

  async createHelperReview(body: CreateReviewDto, userId: string, helperApplicationId: string) {
    const helperPostApplication = await this.helperApplicationRepo.findOneWithHelperPost(helperApplicationId);
    const existReview = await this.reviewRepository.existHelperPostReview(helperApplicationId, userId);
    if (existReview) throw new BadRequestException('이미 리뷰를 남겼습니다.');

    const role = helperPostApplication.client.id === userId ? ReviewRole.HELPER : ReviewRole.CLIENT;
    await this.reviewRepository.createHelperReview({
      rating: body.rating,
      tags: body.tags,
      content: body.content,
      reviewerId: userId, // 작성자
      revieweeId: role === ReviewRole.CLIENT ? helperPostApplication.client.id : helperPostApplication.helperPosts.helper.id,
      role,
      helperApplicationId,
    })
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
