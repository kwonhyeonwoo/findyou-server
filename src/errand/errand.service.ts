import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateErrandDto } from './dto/create-errand.dto';
import { UpdateErrandDto } from './dto/update-errand.dto';
import { ErrandRepository } from './errand.repository';

@Injectable()
export class ErrandService {
  constructor(
    private readonly errandRepository: ErrandRepository
  ) { }
  create(createErrandDto: CreateErrandDto, imagePaths?: string[]) {
    const newErrand = {
      ...createErrandDto,
      images: imagePaths ? imagePaths : []
    }
    return this.errandRepository.createErrand(newErrand)
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
