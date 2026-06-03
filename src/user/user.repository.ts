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

    async findByNickName(nickName:string){
        return await this.repository.findOne({where:{nickName}})
    }

    async findByPhone(phone:string){
        return this.repository.findOne({where:{phone}})
    }

    async findByUser(id:string){
        return this.repository.findOne({where:{id}});
    }
    async updateRefreshToken(userId: string, hashedRefreshToken: string | null): Promise<void> {
        // 상속받았기 때문에 바로 this.update를 쓸 수 있어!
        await this.update(userId, {
          refreshToken: hashedRefreshToken,
        });
      }
}