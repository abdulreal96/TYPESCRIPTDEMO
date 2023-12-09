import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Clients } from "./Clients";


export enum TransactionType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw"
}

@Entity('transaction')
export class Transaction extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: TransactionType
    })
    type: String;

    @Column({
        type: "numeric"
    })
    amount: number;

    @ManyToOne(
        () => Clients,
        clients => clients.transactions
    )
    @JoinColumn({
        name: 'client_id'
    })
    client: Clients;

    @CreateDateColumn()
    created_at: Date;
}

