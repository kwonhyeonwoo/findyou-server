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
  async create(dto: CreateHelperApplicationDto, userId: string, helperPostId: string) {
    // 중복신청 불가능,
    // 내 자신한테 신청 불가능, 1
    // 이미 신청 한 내역 불가능,
    const helper = await this.helperRepository.findOneHelper(helperPostId);
    if (!helper) throw new NotFoundException("헬퍼를 찾을 수 없습니다.");
    if (helperPostId === userId) throw new ConflictException("자신에게 신청할 수 없습니다.");
  }

  async findAll(userId: string) {
    return await this.applicationRepo.findApplications(userId)
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
