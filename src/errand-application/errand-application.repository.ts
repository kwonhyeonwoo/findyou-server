import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ErrandApplication } from "./entities/errand-application.entity";
import { CreateErrandApplicationDto } from "./dto/create-errand-application.dto";

@Injectable()
export class ErrandApplicationRepository extends Repository<ErrandApplication>{
    constructor(private readonly dataSource:DataSource){
        super(ErrandApplication, dataSource.createEntityManager())
    }

    async createApplication(helper:string, errand:string){
        const newApplication = this.create({ 
            helper: { id: helper }, 
            errand: { id: errand } 
        });
        
        return this.save(newApplication);
    }

}