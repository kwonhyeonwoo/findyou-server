import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHelperDto } from './dto/create-helper.dto';
import { UpdateHelperDto } from './dto/update-helper.dto';
import { HelperRepository } from './helper.repository';

@Injectable()
export class HelperService {
  constructor(
    private readonly helperRepository: HelperRepository,
  ) { }
  async create(body: CreateHelperDto, userId: string) {
    const newHelper = {
      ...body,
      user: { id: userId }
    }

    return await this.helperRepository.createHelper(newHelper);

  }

  findAll() {
    return `This action returns all helper`;
  }

  findOne(id: number) {
    return `This action returns a #${id} helper`;
  }

  update(id: number, updateHelperDto: UpdateHelperDto) {
    return `This action updates a #${id} helper`;
  }

  remove(id: number) {
    return `This action removes a #${id} helper`;
  }
}
