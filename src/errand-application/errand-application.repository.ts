import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ErrandApplication } from "./entities/errand-application.entity";
import { Errand } from "../errand/entities/errand.entity";
import { CustomStatus } from "src/interfaces/custom-status.enum";

@Injectable()
export class ErrandApplicationRepository extends Repository<ErrandApplication> {
    constructor(private readonly dataSource: DataSource) {
        super(ErrandApplication, dataSource.createEntityManager())
    }

    async createApplication({
        helperId,
        errandId,
        message,
        openLink,
    }: {
        helperId: string,
        errandId: string,
        message: string,
        openLink:string
    }) {
        const newApplication = this.create({
            helper: { id: helperId },
            errand: { id: errandId },
            openLink,
            message,
        });

        return this.save(newApplication);
    }

    async findErrandWidthUser(applicationId: string, userId: string) {
        const applicationUser = await this.findOne({
            where: {
                id: applicationId,
                errand: { user: { id: userId } },
            },
            relations:{
                    errand:{
                        user:true
                    }
                }
        })
        return applicationUser;
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

    // 지원자 수락
    async accepted(id: string, userId: string) {
        return this.dataSource.transaction(async manager=>{
            const application = await manager.findOne(ErrandApplication,{
                where:{id},
                relations:{errand:{user:true},helper:true}
            })

            if(!application) throw new NotFoundException("지원 내역을 찾을 수 없습니다.");
            const errand = await manager.findOne(Errand,{
                where:{id:application.errand.id},
                relations:{user:true}
            });
            if(!errand) throw new NotFoundException("심부름을 찾을 수 없습니다.");
            if(errand.user.id !== userId) throw new ForbiddenException("권한이 없습니다.");
            await manager.update(ErrandApplication,id,{
                status:CustomStatus.ACCEPTED,
            })
            await manager.update(Errand,errand.id,{
                status:CustomStatus.IN_PROGRESS,
                helper:{id:application.helper.id}
            })
        });
    }


    // 완료요청
    async completedRequest({errandId, appliId}:{
        errandId:string;
        appliId:string;
    }){
        return await this.dataSource.transaction(async manager=>{
            const application = await manager.findOne(ErrandApplication,{
                where:{id:appliId},
                relations:{errand:{user:true}}
            });
            if(!application) throw new NotFoundException("지원 내역을 찾을 수 없습니다.")
            const errand = await manager.findOne(Errand,{
                where:{id:errandId},
                relations:{user:true}
            })
            if(!errand) throw new NotFoundException("심부름을 찾을 수 없습니다.")
            if(errand.user.id !== application.errand.user.id) throw new ForbiddenException("권한이 없습니다.")
            await manager.update(ErrandApplication,appliId,{
                status:CustomStatus.COMPLETED,
            })
            await manager.update(Errand,errandId,{
                status:CustomStatus.COMPLETED_REQUEST,
            })
            await manager.update(ErrandApplication,{
                errand:{id:errandId},
                status:CustomStatus.ACCEPTED,
            },{
                status:CustomStatus.COMPLETED_REQUEST
            })
        })
    }
}