import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('errand')
export class Errand {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    title:string;

    @Column()
    category:string;

    @Column()
    address:string;

    @Column()
    description:string;

    @Column()
    price:string;

    @Column('text', { array: true,  })
    images: string[];

    @Column()
    openLink:string;
}
