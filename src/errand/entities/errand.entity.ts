import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ErrandStatus } from "../interface/errand.interface";
import { User } from "../../user/entities/user.entity";
import { ErrandApplication } from "../../errand-application/entities/errand-application.entity";

@Entity('errand')
export class Errand {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'enum', enum: ErrandStatus, default: ErrandStatus.matching })
    status: ErrandStatus;

    @Column()
    title: string;

    @Column()
    category: string;

    @Column()
    address: string;

    @Column()
    address_dong: string;

    @Column()
    description: string;

    @Column({ type: 'double precision' })
    lat: number;

    @Column({ type: 'double precision' })
    lng: number;

    @Column()
    price: string;

    @Column('text', { array: true, nullable: true })
    images: string[] | null;

    @Column()
    openLink: string;

    @CreateDateColumn()
    createdAt: Date;


    @ManyToOne(() => User, (user) => user.errands, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToMany(()=> ErrandApplication, (application)=>application.errand,{onDelete:"CASCADE"})
    applications:ErrandApplication[];
}
