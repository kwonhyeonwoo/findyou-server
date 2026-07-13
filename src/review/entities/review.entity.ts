import { Errand } from "src/errand/entities/errand.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReviewTag } from "../enum/review-tags.enum";

@Entity('review')
export class Review {
    @PrimaryGeneratedColumn()
    id: string;

    @Column() // 별점
    rating: number;

    @Column({ type: 'enum', enum: ReviewTag, array: true, nullable: true })
    tags: string[];

    @Column() // 리뷰 내용
    content: string;

    @Column()// 리뷰작성자
    reviewr: string; // 리뷰작성자

    @Column()  // 리뷰 대상자
    reviewee: string;

    @Column() // 누구에 대한 리뷰(의뢰인인지, 도움인인지)
    role: "HELPER" | "USER";

    @ManyToOne(() => Errand, (errand) => errand.reviews, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'errandId' })
    errand: Errand;

    @ManyToOne(() => User, (user) => user.reviews)
    @JoinColumn({ name: 'userId' })
    user: User;
}
