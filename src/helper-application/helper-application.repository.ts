import { DataSource, DeepPartial, Repository } from "typeorm";
import { HelperApplication } from "./entities/helper-application.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class HelperApplicationRepository extends Repository<HelperApplication> {
    constructor(private readonly dataSource: DataSource) {
        super(HelperApplication, dataSource.createEntityManager())
    }

    async createApplication({
        message,
        clientId,
        helperId,
    }: {
        message: string,
        clientId: string,
        helperId: string
    }) {
        console.log('cient', clientId)
        const application = this.create({
            message,
            client: { id: clientId },
            helper: { id: helperId },
        });
        return await this.save(application);
    }

    async findOneApplication(helperId: string) {
        console.log('helperId', helperId)
        const application = await this.findOne({
            where: {
                helper: { id: helperId },
            },
            relations: {
                helper: true,
            }
        });
        console.log('tqtqtq', application)
        return application;
    }

    async checkApplication(applicationId: string) {
    }
}