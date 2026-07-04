import { ConflictException, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ErrandApplication } from "./entities/errand-application.entity";
import { UpdateApplicationStatusDto } from "./dto/update-application-status.dto";

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

    async updateStatus(id: string, status: UpdateApplicationStatusDto) {
        return await this.update(id, {
            status: status.status
        })
    }
}