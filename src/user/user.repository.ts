import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private readonly dataSource: DataSource) {
        // 부모인 Repository 클래스에 엔티티와 매니저를 넘겨줍니다.
        super(User, dataSource.createEntityManager());
    }
    
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.create(createUserDto);
        return await this.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.findOne({ where: { email } });
    }

    async findByNickName(nickName: string) {
        return await this.findOne({ where: { nickName } })
    }

    async findByPhone(phone: string) {
        return this.findOne({ where: { phone } })
    }

    async findByUser(id: string) {
        return this.findOne({ where: { id } });
    }

    
    async updateRefreshToken(userId: string, hashedRefreshToken: string | null): Promise<void> {
        await this.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

}