import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateErrandApplicationDto } from './dto/update-errand-application.dto';
import { ErrandApplicationRepository } from './errand-application.repository';
import { ErrandRepository } from 'src/errand/errand.repository';
import { CreateErrandApplicationDto } from './dto/create-errand-application.dto';
import { UserRepository } from 'src/user/user.repository';
import { CustomStatus } from 'src/interfaces/custom-status.enum';

@Injectable()
export class ErrandApplicationService {
  constructor(
    private readonly applicationRepository: ErrandApplicationRepository,
    private readonly errandRepository: ErrandRepository,
    private readonly userRepository: UserRepository
  ) { }


  async create({
    body,
    helperId,
    errandId,
  }: { body: CreateErrandApplicationDto, helperId: string, errandId: string }) {
    const errand = await this.errandRepository.findOneWithUser(errandId);
    if (errand.user.id === helperId) throw new ConflictException('본인의 심부름에는 지원할 수 없습니다.')
    const isExist = await this.applicationRepository.findByErrandAndHelper(helperId, errandId);
    if (isExist) throw new ConflictException('이미 지원한 심부름 입니다.')
    if (body.saveAsDefault) {
      await this.userRepository.updateOpenLink({ userId: helperId, openLink: body.openLink })
    }
    return await this.applicationRepository.createApplication({
      helperId,
      errandId,
      openLink: body.openLink,
      message: body.message
    });
  }


  async getApplications(userId: string) {
    if (!userId) throw new NotFoundException("사용자를 찾을 수 없습니다.")
    return await this.applicationRepository.getApplications(userId);
  }


  // 지원자 수락
  async accepted(id: string, userId: string) {
    const application = await this.applicationRepository.findErrandWidthUser(id, userId);
    if (!application) throw new NotFoundException("심부름을 찾을 수 없습니다.");
    if (application.errand.user.id !== userId) throw new ConflictException("본인의 심부름이 아닙니다.");
    if (application.status !== "PENDING") throw new ConflictException("이미 진행중인 심부름입니다.");
    return await this.applicationRepository.accepted(id, userId);
  }

  async findAll() {
    // return await this.applicationRepository.myApplications()
  }


  findOne(id: number) {
    return `This action returns a #${id} errandApplication`;
  }


  async removeApplication(id: string) {
    if (!id) throw new NotFoundException('삭제 할 내역이 없습니다.')
    return await this.applicationRepository.removeApplication(id)
  }
}