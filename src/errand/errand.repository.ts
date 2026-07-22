import { Injectable } from "@nestjs/common";
import { DataSource, DeepPartial, FindOptionsWhere, ILike, Repository, SelectQueryBuilder } from "typeorm";
import { Errand } from "./entities/errand.entity";
import { ErrandStatus } from "./interface/errand.interface";
import { ErrandApplication } from "../errand-application/entities/errand-application.entity";
import { CustomCategory } from "src/interfaces/custom-category.enum";
import { CustomStatus } from "src/interfaces/custom-status.enum";


@Injectable()
export class ErrandRepository extends Repository<Errand> {
    constructor(
        private readonly dataSource: DataSource,
    ) {
        super(Errand, dataSource.createEntityManager());
    }

    async createErrand(body: DeepPartial<Errand>) {
        const newErrand = this.create(body);
        return await this.save(newErrand);
    }

    async findErrandDetail(id: string) {
        const errand = await this.findOne({
            where: { id },
            relations: { user: true },
            select: {
                user: {
                    id: true,
                    nickName: true,
                    profile: true,
                },
            }
        })
        return errand;
    }

    async findErrandLists({
        limit,
        keyword,
        category,
    }: {
        limit?: string;
        keyword?: string;
        category?: CustomCategory;
    }) {
        const takeValue = limit ? +limit : undefined;
        const whereCondition: FindOptionsWhere<Errand> = {
            status: ErrandStatus.MATCHING
        };
        if (keyword) {
            // 제목에 키워드가 포함된 것을 찾음 (대소문자 구분 없음)
            whereCondition.title = ILike(`%${keyword}%`);
        }
        if (category) {
            whereCondition.category = category;
        }
        const errands = await this.find({
            take: Math.min(takeValue ?? 20, 50),
            where: whereCondition,
            order: {
                createdAt: "DESC"
            }
        });
        return errands;
    }

    async findOneErrand(id: string) {
        const errand = await this.findOne({ where: { id } });
        return errand;
    }

    async completeErrand(id: string) {
        return await this.dataSource.transaction(
            async (transactionalEntityManager) => {
                await transactionalEntityManager.update(
                    Errand,
                    id,
                    { status: ErrandStatus.COMPLETED }
                );

                await transactionalEntityManager.update(
                    ErrandApplication,
                    {
                        errand: { id: id },
                        status: CustomStatus.ACCEPTED
                    },
                    {
                        status: CustomStatus.COMPLETED
                    }
                );
            });
    }

    async findMyErrands(userId: string) {
        return this.find({
            where: { user: { id: userId } },
            relations: {
                applications: {
                    helper: true,
                },
            },
            select: {
                applications: {
                    id: true,
                    message: true,
                    status: true,
                    helper: {
                        id: true,
                        nickName: true,
                        profile: true,
                    },
                },
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
}