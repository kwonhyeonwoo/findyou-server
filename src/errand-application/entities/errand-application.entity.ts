import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Errand } from "../../errand/entities/errand.entity";

@Entity('errand_application')
export class ErrandApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.applications)
    helper: User

    @ManyToOne(() => Errand, (errand) => errand.applications)
    errand: Errand

    @Column({ default: "PENDING" })
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED" | "COMPLETED"
    // pending-> 대기, accepted -> 수락, rejected ->거절 , CANCELED->취소

    @Column({ length: 100, nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn ()
    updatedAt:Date;
}
