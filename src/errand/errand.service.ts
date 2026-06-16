import { Injectable } from '@nestjs/common';
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

  findAll(limit?: string) {
    return this.errandRepository.findAll(limit);
  }

  findOne(id: number) {
    return `This action returns a #${id} errand`;
  }

  update(id: number, updateErrandDto: UpdateErrandDto) {
    return `This action updates a #${id} errand`;
  }

  remove(id: number) {
    return `This action removes a #${id} errand`;
  }
}
