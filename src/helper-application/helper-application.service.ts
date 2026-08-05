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
      const existApplication = await this.applicationRepo.checkApplication(userId,helperId);
      const helper = await this.helperRepository.findOneHelper(helperId);
      if(!helper) throw new NotFoundException("헬퍼를 찾을 수 없습니다.")
      if(helper.helper.id === userId) throw new ConflictException('본인 한테는 신청할 수 없습니다.');
      if(existApplication) throw new NotFoundException('이미 지원한 헬퍼입니다.')
      return await this.applicationRepo.createApplication({
        message:dto.message,
        clientId:userId,
        helperId:helperId
      })      
  }


  async findAll(userId:string) {
    return await this.applicationRepo.findApplications(userId);
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
