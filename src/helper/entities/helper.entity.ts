import { HelperApplication } from "src/helper-application/entities/helper-application.entity";
import { CustomCategory } from "src/interfaces/custom-category.enum";
import { CustomStatus } from "src/interfaces/custom-status.enum";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum HelperMovement {
    BICYCLE = "BICYCLE",
    CAR = "CAR",
    WALK = "WALK",
    MOTORCYCLE = "MOTORCYCLE",
}

@Entity('helper')
export class Helper {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    introduction: string;

    @Column()
    address: string;

    @Column()
    address_dong: string;

    @Column({ type: "enum", enum: HelperMovement })
    movement: HelperMovement;

    @Column({ type: 'double precision' })
    lat: number;

    @Column({ type: 'double precision' })
    lng: number;

    @Column({ type: "enum", enum: CustomCategory })
    category: CustomCategory;

    @Column({ type: "enum", enum: CustomStatus, default: CustomStatus.PENDING })
    status: CustomStatus;

    @Column({ type: "int" })
    price: number;

    @Column()
    openLink: string;

    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.helperPosts)
    @JoinColumn({ name: 'helperId' })
    helper: User;

    @OneToMany(() => HelperApplication, (application) => application.helper)
    applications: HelperApplication[];
}
