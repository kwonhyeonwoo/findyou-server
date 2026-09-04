import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateErrandApplicationDto } from './dto/update-errand-application.dto';
import { ErrandApplicationRepository } from './errand-application.repository';
import { ErrandRepository } from 'src/errand/errand.repository';
import { CreateErrandApplicationDto } from './dto/create-errand-application.dto';
import { UserRepository } from 'src/user/user.repository';

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
    if (!body.message) throw new NotFoundException("메시지를 입력해주세요.");
    if (!body.openLink) throw new NotFoundException("오픈링크를 입력해주세요.");
    const errand = await this.errandRepository.findOneWithUser(errandId);
    if (errand.user.id === helperId) throw new ConflictException('본인의 심부름에는 지원할 수 없습니다.')
    const isExist = await this.applicationRepository.checkExistApplication(helperId, errandId);
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

  async completedRequest({
    errandId,
    appliId,
  }: { errandId: string, appliId: string }) {
    const errand = await this.errandRepository.findErrandWithApplications(errandId);
    if (!errand) throw new NotFoundException("심부름을 찾을 수 없습니다.");
    if (errand.status !== "ACCEPTED") throw new ConflictException("심부름이 진행중이 아닙니다.");
    if (errand.applications.id !== appliId) throw new ConflictException("지원자와 심부름이 일치하지 않습니다.");
    return await this.applicationRepository.completedRequest({ errandId, appliId });
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