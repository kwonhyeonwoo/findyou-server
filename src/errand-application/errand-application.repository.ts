import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ErrandApplication } from "./entities/errand-application.entity";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";
import { Errand } from "src/errand/entities/errand.entity";
import { ErrandStatus } from "src/errand/interface/errand.interface";

@Injectable()
export class ErrandApplicationRepository extends Repository<ErrandApplication> {
    constructor(private readonly dataSource: DataSource) {
        super(ErrandApplication, dataSource.createEntityManager())
    }

    async createApplication(helperId: string, errandId: string, message: string) {
        const newApplication = this.create({
            helper: { id: helperId },
            errand: { id: errandId },
            message,
        });

        return this.save(newApplication);
    }

    async checkExistApplication(helperId: string, errandId: string) {
        return await this.findOne({
            where: {
                helper: { id: helperId },
                errand: { id: errandId },
            }
        })
    }

    async myApplications(helperId: string) {
        return await this.find({
            where: {
                helper: { id: helperId }
            },
            relations: {
                errand: true,
                helper: true,
            }
        })
    }

    async updateStatus(id: string, updateDto: UpdateApplicationStatusDto) {
        // 1. 트랜잭션을 제어하기 위한 QueryRunner 생성
        const queryRunner = this.dataSource.createQueryRunner();

        // 2. DB 연결 및 트랜잭션 시작
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 3. 수락할 지원 내역 찾기 (어떤 심부름인지 알아야 하므로 Errand 정보 조인)
            // 주의: manager를 통해 쿼리를 날려야 트랜잭션에 묶입니다.
            const application = await queryRunner.manager.findOne(ErrandApplication, {
                where: { id },
                relations: { errand: true }, // 엔티티에 @ManyToOne 으로 errand가 연결되어 있어야 함
            });

            if (!application) {
                throw new NotFoundException('해당 지원 내역을 찾을 수 없습니다.');
            }

            const errandId = application.errand.id;

            // 4. 선택된 지원자의 상태 업데이트 (예: ACCEPTED)
            await queryRunner.manager.update(ErrandApplication, id, {
                status: updateDto.status
            });

            // 5. 동일한 심부름에 지원한 '나머지' 지원자들을 거절(REJECTED) 처리
            // QueryBuilder를 사용해 한 번의 쿼리로 일괄 업데이트
            await queryRunner.manager
                .createQueryBuilder()
                .delete() // 기존 .update() 대신 .delete() 사용
                .from(ErrandApplication) // 삭제할 대상 엔티티 지정
                .where('errandId = :errandId', { errandId }) // 해당 심부름에 지원한 것 중
                .andWhere('id != :applicationId', { applicationId: id }) // 수락된 사람은 제외하고
                .execute();

            // 6. 심부름(Errand) 본글의 상태를 '진행 중'으로 업데이트
            await queryRunner.manager.update(Errand, errandId, {
                status: ErrandStatus.in_progress
            });

            // 7. 모든 과정이 에러 없이 통과하면 DB에 커밋 (적용)
            await queryRunner.commitTransaction();

            return { message: '성공적으로 매칭 및 상태가 업데이트되었습니다.' };

        } catch (error) {
            // 에러 발생 시 모든 작업을 취소하고 롤백
            await queryRunner.rollbackTransaction();

            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('트랜잭션 처리 중 오류가 발생했습니다.', error.message);

        } finally {
            // 성공하든 실패하든 QueryRunner 연결 해제 (메모리 누수 방지)
            await queryRunner.release();
        }
    }
}