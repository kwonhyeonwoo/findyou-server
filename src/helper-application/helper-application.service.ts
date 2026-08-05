import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHelperApplicationDto } from './dto/create-helper-application.dto';
import { UpdateHelperApplicationDto } from './dto/update-helper-application.dto';
import { HelperApplicationRepository } from './helper-application.repository';
import { HelperRepository } from 'src/helper/helper.repository';

@Injectable()
export class HelperApplicationService {
  constructor(
    private readonly applicationRepo: HelperApplicationRepository,
    private readonly helperRepository: HelperRepository,
  ) { }
  async create(dto: CreateHelperApplicationDto, userId: string, helperId: string) {
      // 이미 지원한 내역에는 신청 불가능
      // 지원내역조건은 application에 의뢰인이 있는지 확인
      const existApplication = await this.applicationRepo.checkApplication(userId);
      const application = await this.applicationRepo.findOneApplication(helperId);
      console.log('app',application)
      if(existApplication) throw new NotFoundException('이미 지원한 헬퍼입니다.')
      if(application.helper.id === helperId) throw new ConflictException('본인한테는 신청할 수 없습니다.');
      // 본인 자신한테는 신청 불가능
      // 메시지 없으면 안됨
    return await this.applicationRepo.createApplication({
      message:dto.message,
      clientId:userId,
      helperId:helperId
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
