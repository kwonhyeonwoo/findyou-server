import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateErrandApplicationDto } from './dto/update-errand-application.dto';
import { ErrandApplicationRepository } from './errand-application.repository';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ErrandApplicationService {
  constructor(
    private readonly applicationRepository: ErrandApplicationRepository,
  ) { }
  async create(helperId: string, errandId: string, message: string) {
    if (!errandId) throw new NotFoundException("신청 심부름이 없습니다.")
    const isExist = await this.applicationRepository.checkExistApplication(helperId, errandId);
    if (isExist) throw new ConflictException('이미 지원한 심부름 입니다.')
    return await this.applicationRepository.createApplication(helperId, errandId, message);
  }


  async getMyApplications(helperId: string) {
    if (!helperId) throw new NotFoundException("사용자를 찾을 수 없습니다.")
    return await this.applicationRepository.myApplications(helperId);
  }

  async updateStatus(id: string, status: UpdateApplicationStatusDto) {
    return await this.applicationRepository.updateStatus(id, status);
  }

  async findAll() {
    // return await this.applicationRepository.myApplications()
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