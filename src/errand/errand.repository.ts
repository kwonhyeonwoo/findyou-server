import { Injectable } from "@nestjs/common";
import { DataSource, DeepPartial, Repository } from "typeorm";
import { Errand } from "./entities/errand.entity";
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

    // 진행중인 심부름
    async findErrandProgress(id: string) {
        const errand = await this.findOne({
            where: { id },
            relations: {
                applications: {
                    helper: true,
                }
            },
            select: {
                applications: {
                    id: true,
                    helper: {
                        nickName: true,
                        profile: true,
                    },
                },
            }
        })
        return errand;
    }

    // 심부름리스트(검색,카테고리 필터까지)
    async findErrandLists({
        status,
        limit,
        keyword,
        category,
    }: {
        status?: CustomStatus,
        limit?: string;
        keyword?: string;
        category?: CustomCategory;
    }) {
        const takeValue = limit ? +limit : undefined;
        const statusValue = status ?? CustomStatus.MATCHING;

        const qb = this.createQueryBuilder('errand')
            .where('errand.status = :status', { status: statusValue })
            .loadRelationCountAndMap('errand.applicationsCount', 'errand.applications')
            .orderBy('errand.createdAt', 'DESC')
            .take(Math.min(takeValue ?? 20, 50));

        if (keyword) {
            // 제목에 키워드가 포함된 것을 찾음 (대소문자 구분 없음)
            qb.andWhere('errand.title ILIKE :keyword', { keyword: `%${keyword}%` });
        }
        if (category) {
            qb.andWhere('errand.category = :category', { category });
        }

        const errands = await qb.getMany();
        return errands;
    }

    async findOneErrand(id: string) {
        return await this.findOne({
            where: { id },
            relations: { user: true },
            select: {
                user: {
                    id: true,
                }
            }
        });
    }

    // 심부름완료
    async completeErrand(id: string) {
        return await this.dataSource.transaction(
            async (transactionalEntityManager) => {
                await transactionalEntityManager.update(
                    Errand,
                    id,
                    { status: CustomStatus.COMPLETED }
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