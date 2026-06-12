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

    @Column({ type: 'double precision' })
    lat: number;

    @Column({ type: 'double precision' })
    lng: number;

    @Column()
    price:string;

    @Column('text', { array: true, nullable: true }) 
    images: string[] | null;

    @Column()
    openLink:string;
}
