import { ConflictException, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ErrandApplication } from "./entities/errand-application.entity";

@Injectable()
export class ErrandApplicationRepository extends Repository<ErrandApplication>{
    constructor(private readonly dataSource:DataSource){
        super(ErrandApplication, dataSource.createEntityManager())
    }

    async createApplication(helperId:string, errandId:string){
        const newApplication = this.create({ 
            helper: { id: helperId }, 
            errand: { id: errandId }, 
        });
        
        return this.save(newApplication);
    }

    async checkExistApplication(helperId:string, errandId:string){
        return await this.findOne({
            where:{
                helper:{id:helperId},
                errand:{id:errandId},
            }
        })
    }

    async myApplications(helperId:string){
        return await this.find({
            where:{
                helper:{id:helperId}
            },
            relations:{
                errand:true,
                helper:true,
            }
        })
    }
}