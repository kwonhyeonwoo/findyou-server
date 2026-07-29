import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ErrandApplication } from "./entities/errand-application.entity";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";
import { Errand } from "../errand/entities/errand.entity";
import { CustomStatus } from "src/interfaces/custom-status.enum";

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

    async updateStatus(id: string, userId:string) {
        // 1. 트랜잭션을 제어하기 위한 QueryRunner 생성
        const queryRunner = this.dataSource.createQueryRunner();

        // 2. DB 연결 및 트랜잭션 시작
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{    
            const application = await queryRunner.manager.findOne(ErrandApplication,{
                where:{id},
                relations:{errand:true,helper:true},
            })
            if(!application) throw new NotFoundException("해당 지원 내역을 찾을 수 없습니다.")
            
            const errand = application.errand;
            if(!errand) throw new NotFoundException('심부름이 없습니다.')
            if(errand.status === CustomStatus.IN_PROGRESS){
                throw new BadRequestException('이미 진행중인 심부름 입니다.')
            }
            if (errand.user.id !== userId) {
                throw new ForbiddenException('본인 심부름의 지원자만 수락할 수 있습니다.');
            }
            // 심부름 수락
            await queryRunner.manager.update(ErrandApplication,
                {
                    id,
                    status:CustomStatus.PENDING,
                },{
                status:CustomStatus.ACCEPTED,
            })

            // 나머지 내역들은 다 거절
            await queryRunner.manager.update(ErrandApplication,{
                errand:{id:errand.id},
                status:CustomStatus.PENDING
            },{
                status:CustomStatus.REJECTED,
            })

            await queryRunner.manager.update(Errand,errand.id,{
                helper:{id:application.helper.id},
                status:CustomStatus.IN_PROGRESS,
            })
            await queryRunner.commitTransaction()
            }catch(error){
                await queryRunner.rollbackTransaction()
                throw error

        }finally{
            await queryRunner.release()
        }
    }
}