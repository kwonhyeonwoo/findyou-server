import { Helper } from "src/helper/entities/helper.entity";
import { CustomStatus } from "src/interfaces/custom-status.enum";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('helper_application')
export class HelperApplication {
    @PrimaryColumn('uuid')
    id:string

    // 의뢰인
    @ManyToOne(()=>User, (user)=>user.helperApplications,{onDelete:"CASCADE"})
    client:User

    //헬퍼
    @ManyToOne(()=>Helper,(helper)=>helper.applications)
    helper:Helper;
    
    // 상태
    @Column({type:'enum',enum:CustomStatus, default:CustomStatus.PENDING})
    status:CustomStatus

    @Column({length:100, nullable:true})
    message:string;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    updatedAt:Date;
}
