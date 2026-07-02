import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateErrandDto } from './dto/create-errand.dto';
import { UpdateErrandDto } from './dto/update-errand.dto';
import { ErrandRepository } from './errand.repository';
import { Errand } from './entities/errand.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class ErrandService {
  constructor(
    private readonly errandRepository: ErrandRepository,
    private readonly userRepository: UserRepository,
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
    const user = await this.userRepository.findByUser(userId);
    if (!user) throw new NotFoundException('회원을 찾을 수 없습니다.');
    const newErrand = {
      ...createErrandDto,
      images: imagePaths,
      user,
    };
    return await this.errandRepository.createErrand(newErrand as Errand);
  }

  async getMyErrands(userId: string) {
    return this.errandRepository.findMyErrands(userId);
  }

  findAll({
    limit,
    keyword,
    category,
  }: {
    limit?: string;
    keyword?: string;
    category?: string;
  }) {
    return this.errandRepository.findAll({ limit, keyword, category });
  }

  findOne(id: string) {
    if (!id) throw new NotFoundException("존재하지 않는 게시글입니다.");
    return this.errandRepository.findErrandById(id);
  }
  update(id: number, updateErrandDto: UpdateErrandDto) {
    return `This action updates a #${id} errand`;
  }

  remove(id: number) {
    return `This action removes a #${id} errand`;
  }
}
