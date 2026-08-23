import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReviewTag } from "../enum/review-tags.enum";
import { ReviewRole } from "../enum/review-role.enum";
import { HelperApplication } from "src/helper-application/entities/helper-application.entity";
import { ErrandApplication } from "src/errand-application/entities/errand-application.entity";

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column() // 별점
    rating: number;

    @Column({ type: 'enum', enum: ReviewTag, array: true, nullable: true })
    tags: ReviewTag[];

    @Column() // 리뷰 내용
    content: string;

    @ManyToOne(() => User, (user) => user.writeReviews, { onDelete: "CASCADE" })// 리뷰작성자
    reviewer: User; // 리뷰작성자

    @ManyToOne(() => User, (user) => user.receivedReviews, { onDelete: "CASCADE" })
    reviewee: User;// 리뷰 대상자


    // role 리뷰를 받는 대상자로 구분
    // helper 게시글이면 helper, 심부름 게시글이면 client
    @Column({ type: "enum", enum: ReviewRole, nullable: true }) // 누구에 대한 리뷰(의뢰인인지, 도움인인지)
    role: ReviewRole;

    @ManyToOne(() => ErrandApplication, (errand) => errand.reviews, { onDelete: 'CASCADE', nullable: true })
    errandApplication: ErrandApplication;

    @ManyToOne(() => HelperApplication, (application) => application.reviews, { onDelete: "CASCADE", nullable: true })
    helperApplication: HelperApplication;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
