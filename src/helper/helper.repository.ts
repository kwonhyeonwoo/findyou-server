import { DataSource, DeepPartial, Repository } from "typeorm";
import { Helper } from "./entities/helper.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CustomStatus } from "src/interfaces/custom-status.enum";

@Injectable()
export class HelperRepository extends Repository<Helper> {
    constructor(
        private readonly dataSource: DataSource,
    ) {
        super(Helper, dataSource.createEntityManager());
    }

    async createHelper(body: DeepPartial<Helper>) {
        const newHelper = this.create(body);
        return await this.save(newHelper);
    }

    async findLists() {
        return await this.find({
            relations: {
                helper: {
                    receivedReviews: true
                }
            },
            select: {
                helper: {
                    id: true,
                    nickName: true,
                    profile: true,
                    receivedReviews: true,
                }
            }
        })
    }

    async findHelper(helperId:string){
        const helper = await this.findOne({
            where:{id:helperId},
            relations:{
                helper:{
                    errands:{
                        status:CustomStatus.COMPLETED
                    }
                }
            },
            select:{

            }
        });
        
        return helper;
    }
}