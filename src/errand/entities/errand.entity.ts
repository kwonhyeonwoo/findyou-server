import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ErrandStatus } from "../interface/errand.interface";
import { User } from "../../user/entities/user.entity";

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
    address_dong:string;

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
}
