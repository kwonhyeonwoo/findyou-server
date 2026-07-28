import {
    Column, CreateDateColumn, UpdateDateColumn, Entity, Index,
    JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from "typeorm";
import { ErrandStatus } from "../interface/errand.interface";
import { User } from "../../user/entities/user.entity";
import { ErrandApplication } from "../../errand-application/entities/errand-application.entity";
import { Review } from "src/review/entities/review.entity";
import { CustomCategory } from "src/interfaces/custom-category.enum";

@Index(['status', 'category'])
@Index(['status', 'address_dong'])
@Entity('errand')
export class Errand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: ErrandStatus, default: ErrandStatus.MATCHING })
    status: ErrandStatus;

    @Column({ type: 'enum', enum: CustomCategory })
    category: CustomCategory;

    @Column()
    title: string;

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

    @Column({ type: 'int' })
    price: number;

    @Column('text', { array: true, nullable: true })
    images: string[] | null;

    @Column()
    deadlineTime: Date;

    @Column()
    openLink: string;

    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // 의뢰인
    @ManyToOne(() => User, (user) => user.errands, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    // 매칭된 헬퍼 (수락 전에는 null)
    @ManyToOne(() => User, (user) => user.helpingErrands, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'helperId' })
    helper: User | null;

    @OneToMany(() => ErrandApplication, (application) => application.errand)
    applications: ErrandApplication[];

    // loadRelationCountAndMap으로 매핑되는 값 (컬럼 아님)
    applicationsCount?: number;

    @OneToMany(() => Review, (review) => review.errand)
    reviews: Review[];
}