import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateErrandDto } from './dto/create-errand.dto';
import { ErrandRepository } from './errand.repository';
import { CustomCategory } from 'src/interfaces/custom-category.enum';
import { CustomStatus } from 'src/interfaces/custom-status.enum';

@Injectable()
export class ErrandService {
  constructor(
    private readonly errandRepository: ErrandRepository,
  ) { }
  async create(
    {
      createErrandDto,
      imagePaths,
      userId
    }: {
      createErrandDto: CreateErrandDto,
      imagePaths?: string[],
      userId: string;
    }
  ) {
    const newErrand = {
      ...createErrandDto,
      images: imagePaths,
      user: { id: userId },
      status: CustomStatus.PENDING,
    };
    return await this.errandRepository.createErrand(newErrand);
  }

  async findMyErrands(userId: string) {
    const errands =  await this.errandRepository.findMyErrands(userId);
    return errands;
  }

  async findErrandLists({
    status,
    limit,
    keyword,
    category,
  }: {
    status?: CustomStatus,
    limit?: string;
    keyword?: string;
    category?: CustomCategory;
  }) {
    return this.errandRepository.findErrandLists({ status, limit, keyword, category });
  }

  async findErrandProgress(id: string) {
    const errand = await this.errandRepository.findErrandProgress(id);
    return errand;
  }

  async findErrandDetail(id: string) {
    if (!id) throw new NotFoundException("심부름이 없습니다.")
    return await this.errandRepository.findOneErrand(id);
  }

  async completeErrand(id: string, userId: string) {
    const errand = await this.errandRepository.findOneErrand(id);
    if (!errand) {
      throw new NotFoundException('심부름을 찾을 수 없습니다.');
    }
    if (errand.user.id !== userId) {
      throw new ForbiddenException('심부름 완료 권한이 없습니다.');
    }
    if (errand.status !== CustomStatus.IN_PROGRESS) {
      throw new BadRequestException('진행중인 심부름만 완료할 수 있습니다.');
    }
    return await this.errandRepository.completeErrand(id);
  }
}
