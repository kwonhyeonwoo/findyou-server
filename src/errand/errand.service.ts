import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateErrandDto } from './dto/create-errand.dto';
import { ErrandRepository } from './errand.repository';
import { ErrandStatus } from './interface/errand.interface';
import { CustomCategory } from 'src/interfaces/custom-category.enum';

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
      status: ErrandStatus.MATCHING,
    };
    return await this.errandRepository.createErrand(newErrand);
  }

  async findMyErrands(userId: string) {
    return await this.errandRepository.findMyErrands(userId);
  }

  async findErrandLists({
    limit,
    keyword,
    category,
  }: {
    limit?: string;
    keyword?: string;
    category?: CustomCategory;
  }) {
    return this.errandRepository.findErrandLists({ limit, keyword, category });
  }

  async findErrandDetail(id: string) {
    const errand = await this.errandRepository.findErrandDetail(id);
    return errand;
  }

  async completeErrand(id: string, userId: string) {
    const errand = await this.errandRepository.findOneErrand(id);
    if (!errand) {
      throw new NotFoundException('심부름을 찾을 수 없습니다.');
    }
    if (errand.user.id !== userId) {
      throw new ForbiddenException('심부름 완료 권한이 없습니다.');
    }
    if (errand.status !== ErrandStatus.IN_PROGRESS) {
      throw new BadRequestException('진행중인 심부름만 완료할 수 있습니다.');
    }
    return await this.errandRepository.completeErrand(id);
  }
}
