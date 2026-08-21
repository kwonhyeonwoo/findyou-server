import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHelperApplicationDto } from './dto/create-helper-application.dto';
import { UpdateHelperApplicationDto } from './dto/update-helper-application.dto';
import { HelperApplicationRepository } from './helper-application.repository';
import { HelperPostRepository } from 'src/helper-post/helper-post.repository';
import { CustomStatus } from 'src/interfaces/custom-status.enum';

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

  // 완료요청 수락
  async completed(id:string, userId:string){
    if(!id) throw new NotFoundException('내역을 찾을 수 없습니다.');
    const application = await this.applicationRepo.findOneApplicationWidthClient(id);
    if(application.client.id !== userId) throw new BadRequestException('본인만 수락이 가능합니다.');
    return await this.applicationRepo.completed(id);
  }

  async findOneApplicationWidthClient(id: string) {
    if (!id) throw new NotFoundException("신청내역이 없습니다.")
    const application = await this.applicationRepo.findOneApplicationWidthClient(id);
    return application
  }

  async accepted(id: string) {
    await this.applicationRepo.accepted(id);

  }

  async completedRequest(appliId: string, userId: string) {
  if (!appliId) throw new BadRequestException('신청 ID가 없습니다.');

  const application = await this.applicationRepo.findOneApplicationWidthClient(appliId);
  if (!application) throw new NotFoundException('내역을 찾을 수 없습니다.');

  // 완료 요청은 헬퍼만 (신청에 연결된 게시글의 작성자)
  const helperId = application.helperPosts.helper.id;
  if (userId !== helperId) {
    throw new ForbiddenException('완료 요청은 헬퍼만 할 수 있습니다.');
  }

  if (application.status === CustomStatus.COMPLETED_REQUEST) {
    throw new BadRequestException('이미 완료 요청된 내역입니다.');
  }

  return this.applicationRepo.completedRequest(appliId);
}

// 거절
async rejected(id:string,userId:string){
  const application = await this.applicationRepo.rejected(id,userId);
  return application;
}

// 지원내역 삭제
async remove(id:string,userId:string){
  if(!id) throw new NotFoundException('내역이 존재하지 않습니다.')
  const application = await this.applicationRepo.findOneApplicationWidthClient(id);
  if(application.client.id !== userId) throw new BadRequestException('지원자 본인만 취소 가능 합니다.');
  return await this.applicationRepo.removeApplication(id);
}

  update(id: number, updateHelperApplicationDto: UpdateHelperApplicationDto) {
    return `This action updates a #${id} helperApplication`;
  }


}
