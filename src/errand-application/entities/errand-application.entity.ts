import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Errand } from "../../errand/entities/errand.entity";
import { CustomStatus } from "src/interfaces/custom-status.enum";
import { Review } from "src/review/entities/review.entity";

@Entity('errand_application')
export class ErrandApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 헬퍼
    @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
    helper: User

    // 심부름게시글
    @ManyToOne(() => Errand, (errand) => errand.applications, { onDelete: 'CASCADE' })
    errand: Errand

    @Column({ type: "enum", enum: CustomStatus, default: CustomStatus.PENDING })
    status: CustomStatus

    @Column({ length: 100, nullable: true })
    message: string;

    @OneToMany(() => Review, (review) => review.errandApplication)
    reviews: Review[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
