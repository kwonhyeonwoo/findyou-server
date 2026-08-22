import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHelperApplicationDto } from './dto/create-helper-application.dto';
import { UpdateHelperApplicationDto } from './dto/update-helper-application.dto';
import { HelperApplicationRepository } from './helper-application.repository';
import { HelperPostRepository } from 'src/helper-post/helper-post.repository';

@Injectable()
export class HelperApplicationService {
  constructor(
    private readonly applicationRepo: HelperApplicationRepository,
    private readonly helperRepository: HelperPostRepository,
  ) { }
  async create(dto: CreateHelperApplicationDto, userId: string, helperPostId: string) {
    const helper = await this.helperRepository.findOneHelper(helperPostId);
    const existApplication = await this.applicationRepo.checkApplication(userId, helperPostId);
    if (helper.helper.id === userId) throw new ConflictException("자신에게 신청할 수 없습니다.");
    if (existApplication) throw new ConflictException('이미 신청한 내역 입니다.')
    if (!helper) throw new NotFoundException("헬퍼를 찾을 수 없습니다.");
    return await this.applicationRepo.createApplication({
      message: dto.message,
      clientId: userId,
      helperId: helperPostId
    })
  }

  // 지원내역
  async findHistory(userId: string) {
    return await this.applicationRepo.findApplicationsHistory(userId)
  }

  // 받은내역
  async findReceivedApplications(helperPostId: string) {
    const applications = await this.applicationRepo.findReceivedApplications(helperPostId);
    return applications;
  }

  async findOne(helperId: string) {
    if (!helperId) throw new NotFoundException("신청내역이 없습니다.")
    const application = await this.applicationRepo.findeOneWidthHelperPost(helperId);
    return application
  }

  async accepted(id: string) {
    await this.applicationRepo.accepted(id);

  }

  async rejected(id: string, userId: string) {
    if (!id) throw new NotFoundException('내역이 존재하지 않습니다.');
    return await this.applicationRepo.rejected(id, userId);
  }
  async remove(id: string) {
    if (!id) throw new NotFoundException('삭제 할 내역이 없습니다.')
    return this.applicationRepo.deleteApplication(id);
  }
  update(id: number, updateHelperApplicationDto: UpdateHelperApplicationDto) {
    return `This action updates a #${id} helperApplication`;
  }


}
