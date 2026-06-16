import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IUserRole } from "../interfaces/user-role";
import { Errand } from "../../errand/entities/errand.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: IUserRole })
    type: IUserRole;

    @Column()
    division: "kakao" | "naver" | "email";

    @Column()
    email: string;

    @Column({ unique: true })
    nickName: string;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    address_dong:string;

    @Column({ type: 'double precision' })
    lat: number; // 위도

    @Column({ type: 'double precision' })
    lng: number; // 경도

    @Column()
    password: string;

    @Column()
    agreeUsage: boolean;

    @Column()
    agreePrivacy: boolean;

    @Column()
    agreeMarketingMandatory: boolean;

    @Column()
    agreeMarketingOptional: boolean;

    @Column({ nullable: true })
    refreshToken: string | null;

    @OneToMany(() => Errand, (errand) => errand.user)
    errands: Errand[];
}
