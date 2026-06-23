import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateErrandApplicationDto } from './dto/create-errand-application.dto';
import { UpdateErrandApplicationDto } from './dto/update-errand-application.dto';
import { ErrandApplicationRepository } from './errand-application.repository';

@Injectable()
export class ErrandApplicationService {
  constructor(
    private readonly applicationRepository:ErrandApplicationRepository,
  ){}
  async create(helperId:string, errandId:string) {
    if(errandId) throw new NotFoundException("신청 심부름이 없습니다.")
    return await this.applicationRepository.createApplication(helperId,errandId);
  }

  findAll() {
    return `This action returns all errandApplication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} errandApplication`;
  }

  update(id: number, updateErrandApplicationDto: UpdateErrandApplicationDto) {
    return `This action updates a #${id} errandApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} errandApplication`;
  }
}
