import { Injectable } from "@nestjs/common";
import { DataSource, FindOptionsWhere, ILike, Repository } from "typeorm";
import { Errand } from "./entities/errand.entity";


@Injectable()
export class ErrandRepository extends Repository<Errand> {
    constructor(
        private readonly dataSource: DataSource,
    ) {
        super(Errand, dataSource.createEntityManager());
    }

    async createErrand(body: Errand): Promise<Errand> {
        const newErrand = await this.create(body);
        return await this.save(newErrand);
    }

    async findAll({
        limit,
        keyword,
        category,
    }: {
        limit?: string;
        keyword?: string;
        category?: string;
    }) {
        const takeValue = limit ? +limit : undefined;
        const whereCondition: FindOptionsWhere<Errand> = {};
        if (keyword) {
            // 제목에 키워드가 포함된 것을 찾음 (대소문자 구분 없음)
            whereCondition.title = ILike(`%${keyword}%`);
        }

        if (category && category !== 'all') {
            whereCondition.category = category;
        }
        const errands = await this.find({
            take: takeValue,
            where: whereCondition,
            relations: {
                applications: true,
            },
            order: {
                createdAt: "DESC"
            }
        });
        return errands;
    }

    async findErrandById(id: string) {
        const errand = await this.findOne({
            where: { id },
            relations: {
                user: true,
            },
        });
        return errand;
    }

    async findMyErrands() {
        const errands = await this.find({
            relations: {
                applications: {
                    helper: true,
                },
            }
        });
        return errands;
    }
}