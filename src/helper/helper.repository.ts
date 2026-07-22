import { DataSource, DeepPartial, Repository } from "typeorm";
import { Helper } from "./entities/helper.entity";
import { Injectable } from "@nestjs/common";

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
}