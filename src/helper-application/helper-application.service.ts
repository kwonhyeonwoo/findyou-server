import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHelperApplicationDto } from './dto/create-helper-application.dto';
import { UpdateHelperApplicationDto } from './dto/update-helper-application.dto';
import { HelperApplicationRepository } from './helper-application.repository';
import { HelperPostRepository } from 'src/helper-post/helper-post.repository';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class HelperApplicationService {
  constructor(
    private readonly applicationRepo: HelperApplicationRepository,
    private readonly helperRepository: HelperPostRepository,
    private readonly userRepository: UserRepository,
  ) { }
  async create(dto: CreateHelperApplicationDto, userId: string, helperPostId: string) {
    const helper = await this.helperRepository.findOneHelper(helperPostId);
    if (!helper) throw new NotFoundException("게시글이 존재하지 않습니다.");

    const existApplication = await this.applicationRepo.checkApplication(userId, helperPostId);
    if (helper.helper.id === userId) throw new ConflictException("자신에게 신청할 수 없습니다.");
    if (existApplication) throw new ConflictException('이미 신청한 내역 입니다.')
    if (dto.saveAsDefault) {
      await this.userRepository.updateOpenLink({ userId, openLink: dto.openLink })
    }
    return await this.applicationRepo.createApplication({
      message: dto.message,
      clientId: userId,
      openLink: dto.openLink,
      helperId: helperPostId
    })
  }

  // 지원내역
  async findHistory(userId: string) {
    return await this.applicationRepo.findApplicationsHistory(userId)
  }

  // 받은내역
  async findReceivedApplications(id: string) {
    const applications = await this.applicationRepo.findReceivedApplications(id);
    return applications;
  }

  async findOne(appliId: string) {
    if (!appliId) throw new NotFoundException("신청내역이 없습니다.")
    const application = await this.applicationRepo.findOneWithHelperPost(appliId);
    return application
  }

  async accepted(id: string) {
    await this.applicationRepo.accepted(id);
  }

  // 거절
  async rejected(id: string, userId: string) {
    if (!id) throw new NotFoundException('내역이 존재하지 않습니다.');
    return await this.applicationRepo.rejected(id, userId);
  }

  // 지원내역 삭제
  async remove(id: string, userId: string) {
    if (!id) throw new NotFoundException('내역이 존재하지 않습니다.')
    const application = await this.applicationRepo.findOneWithHelperPost(id);
    if (!application) throw new NotFoundException('내역을 찾을 수 없습니다.');
    if (application.client.id !== userId) throw new BadRequestException('지원자 본인만 취소 가능 합니다.');
    return await this.applicationRepo.removeApplication(id);
  }

  update(id: number, updateHelperApplicationDto: UpdateHelperApplicationDto) {
    return `This action updates a #${id} helperApplication`;
  }
}
