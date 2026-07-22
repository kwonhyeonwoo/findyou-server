import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Errand } from "../../errand/entities/errand.entity";
import { CustomStatus } from "src/interfaces/custom-status.enum";

@Entity('errand_application')
export class ErrandApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
    helper: User

    @ManyToOne(() => Errand, (errand) => errand.applications, { onDelete: 'CASCADE' })
    errand: Errand

    @Column({ type: "enum", enum: CustomStatus, default: CustomStatus.PENDING })
    status: CustomStatus

    @Column({ length: 100, nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
