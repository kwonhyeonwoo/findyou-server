import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHelperApplicationDto } from './dto/create-helper-application.dto';
import { UpdateHelperApplicationDto } from './dto/update-helper-application.dto';
import { HelperApplicationRepository } from './helper-application.repository';

@Injectable()
export class HelperApplicationService {
  constructor(
    private readonly applicationRepo: HelperApplicationRepository,
  ) { }
  async create(dto: CreateHelperApplicationDto, userId: string) {
    const application = await this.applicationRepo.findOneApplication(dto.helperId);
    console.log('application', application)
    if (dto.helperId === userId) throw new ConflictException('본인한테 신청할 수 없습니다.');
    if (application.client.id === userId) throw new ConflictException('이미 신청한 헬퍼 입니다.')
    console.log("여기에서에러가?")
    return await this.applicationRepo.createApplication({
      message: dto.message,
      clientId: userId,
      helperId: dto.helperId,
    })
  }

  findAll() {
    return `This action returns all helperApplication`;
  }

  async findOne(helperId: string) {
    if (!helperId) throw new NotFoundException("신청내역이 없습니다.")
    const application = await this.applicationRepo.findOneApplication(helperId);
    return application
  }
  update(id: number, updateHelperApplicationDto: UpdateHelperApplicationDto) {
    return `This action updates a #${id} helperApplication`;
  }

  remove(id: number) {
    return `This action removes a #${id} helperApplication`;
  }
}
