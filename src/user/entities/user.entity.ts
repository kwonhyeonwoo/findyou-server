import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUserRole } from "../interfaces/user-role";

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

    @Column({ type: 'double precision' })
    lat: number;

    @Column({ type: 'double precision' })
    lng: number;

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
}
