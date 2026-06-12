import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Errand } from "./entities/errand.entity";
import { CreateErrandDto } from "./dto/create-errand.dto";


@Injectable()
export class ErrandRepository extends Repository<Errand> {
    constructor(private readonly dataSource: DataSource) {
        // 부모인 Repository 클래스에 엔티티와 매니저를 넘겨줍니다.
        super(Errand, dataSource.createEntityManager());
    }
    
    async createErrand(createErrandBody: CreateErrandDto): Promise<Errand> {
        const newUser = this.create(createErrandBody);
        return await this.save(newUser);
    }

}