import { Injectable } from "@nestjs/common";
import { DataSource, FindOptionsWhere, ILike, Repository } from "typeorm";
import { Errand } from "./entities/errand.entity";
import { CreateErrandDto } from "./dto/create-errand.dto";
import { ErrandCategory } from "./interface/errand.interface";
import { User } from "src/user/entities/user.entity";


@Injectable()
export class ErrandRepository extends Repository<Errand> {
    constructor(private readonly dataSource: DataSource) {
        // 부모인 Repository 클래스에 엔티티와 매니저를 넘겨줍니다.
        super(Errand, dataSource.createEntityManager());
    }

    async createErrand(createErrandBody: CreateErrandDto, userId: string): Promise<Errand> {
        const newErrand = this.create(createErrandBody);
        newErrand.user = { id: userId } as User;

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
        console.log('errand', errand);
        return errand;
    }
}