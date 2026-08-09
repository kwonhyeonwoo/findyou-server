import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Errand } from "../../errand/entities/errand.entity";
import { ErrandApplication } from "../../errand-application/entities/errand-application.entity";
import { Review } from "src/review/entities/review.entity";
import { HelperPost } from "src/helper-post/entities/helper-post.entity";
import { HelperApplication } from "src/helper-application/entities/helper-application.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    profile: string;

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

    @Column()
    address_dong: string;

    @Column({ type: 'double precision' })
    lat: number; // 위도

    @Column({ type: 'double precision' })
    lng: number; // 경도

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

    @OneToMany(() => Errand, (errand) => errand.user)
    errands: Errand[];

    // 내가 수행 한 심부름 
    @OneToMany(() => ErrandApplication, (application) => application.helper)
    applications: ErrandApplication[]

    // 작성 한 리뷰
    @OneToMany(() => Review, (review) => review.reviewer, { onDelete: "CASCADE" })
    writeReviews: Review[]

    // 받은 리뷰
    @OneToMany(() => Review, (review) => review.reviewee)
    receivedReviews: Review[]

    // 매칭된 심부름
    @OneToMany(() => Errand, (errand) => errand.helper)
    helpingErrands: Errand[]

    @OneToMany(() => HelperPost, (helper) => helper.helper)
    helperPosts: HelperPost[];


    // 헬퍼신청서 내역들
    @OneToMany(() => HelperApplication, (helperApplications) => helperApplications.client)
    helperApplications: HelperApplication[]
}
