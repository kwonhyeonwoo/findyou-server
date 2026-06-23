import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Errand } from "../../errand/entities/errand.entity";

@Entity('errand-application')
export class ErrandApplication {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>User,(user)=>user.applications)
    helper:User

    @ManyToOne(()=>Errand, (errand)=>errand.applications)
    errand:Errand

    @Column({default:"PENDING"})
    status:"PENDING" | "ACCEPTED" | "REJECTED"
    // pending-> 대기, accepted -> 수락, rejected ->거절
}
