import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    private readonly repository: Repository<User>;

    constructor(private readonly dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.repository.create(createUserDto);
        return await this.repository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email } });
    }
}