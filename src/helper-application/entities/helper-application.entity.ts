import { HelperPost } from "src/helper-post/entities/helper-post.entity";
import { CustomStatus } from "src/interfaces/custom-status.enum";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('helper_application')
export class HelperApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string

    // 의뢰인
    @ManyToOne(() => User, (user) => user.helperApplications, { onDelete: "CASCADE" })
    @JoinColumn({ name: "clientId" })
    client: User

    //헬퍼
    @ManyToOne(() => HelperPost, (helper) => helper.applications)
    @JoinColumn({ name: "helperPostsId" })
    helperPosts: HelperPost;

    // 상태
    @Column({ type: 'enum', enum: CustomStatus, default: CustomStatus.PENDING })
    status: CustomStatus

    @Column({ length: 100, nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
