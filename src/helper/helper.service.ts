import { Injectable, NotFoundException } from '@nestjs/common';
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
      helper: { id: userId }
    }

    return await this.helperRepository.createHelper(newHelper);

  }

  findAll() {
    return this.helperRepository.findLists();
  }

  async findOne(helperId: string, limit?: string) {
    const helper = await this.helperRepository.findHelperProfile(helperId, limit);
    if (!helper) {
      throw new NotFoundException('헬퍼가 없습니다.')
    };
    return helper;
  }

  update(id: number, updateHelperDto: UpdateHelperDto) {
    return `This action updates a #${id} helper`;
  }

  remove(id: number) {
    return `This action removes 3 #${id} helper`;
  }
}
