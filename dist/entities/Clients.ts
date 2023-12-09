import {Column, CreateDateColumn, Entity, ManyToMany, OneToMany, UpdateDateColumn} from "typeorm";
import { Person } from "./Person";
import { Transaction } from "./Transaction";
import { Banker } from "./Banker";

@Entity('clients')
export class Clients extends Person{

    @Column({
        unique: true,
        length: 10
    })
    card_number: string;

    @Column({
        type: "numeric"
    })
    balance: number;

    @Column({
        default: true
    })
    is_active: boolean;

    @Column({
        type: "simple-json",
        nullable: true
    })
    additional_info: {
        age: number;
        hair_color: string;
    }

    @Column({
        type: "simple-array",
        nullable: true
    })
    family_members: [];

    @OneToMany(
        () => Transaction,
        transaction => transaction.client
    )
    transactions: Transaction[]

    @ManyToMany(
        () => Banker
    )
    bankers: Banker[]; 

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
