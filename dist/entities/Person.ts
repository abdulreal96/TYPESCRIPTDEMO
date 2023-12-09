import {BaseEntity, Column, PrimaryGeneratedColumn} from "typeorm";

export class Person extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({unique: true})
    email: string;

}
