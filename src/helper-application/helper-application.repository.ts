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
        const application = this.create({
            message,
            client: { id: clientId },
            helperPosts: { id: helperId },
        });
        return await this.save(application);
    }

    async findOneApplication(helperId: string) {
        const application = await this.findOne({
            where: {
                helperPosts: { id: helperId },
            },
            relations: { helperPosts: true }
        });
        return application;
    };

    async checkApplication(clientId: string, helperId: string) {
        const existApplication = await this.findOne({
            where: {
                client: {
                    id: clientId
                },
                helperPosts: { id: helperId }
            }
        })
        return existApplication;
    }

    // 지원내역
    async findApplicationsHistory(userId: string) {
        const applications = await this.find({
            where: {
                client: {
                    id: userId
                }
            },
            relations: {
                helperPosts: true
            }
        })
        return applications;
    }


    // 받은내역
    async findReceivedApplications() { }
}