import {Column, CreateDateColumn, Entity, JoinTable, ManyToMany, UpdateDateColumn} from "typeorm";
import { Person } from "./Person";
import { Clients } from "./Clients";

@Entity('banker')
export class Banker extends Person{


   @Column({
    unique: true,
    length: 10
   })
   employee_number: string;

   @ManyToMany(
        () => Clients
   )
   @JoinTable({
        name: "bankers_clients",
        joinColumn: {
            name: "banker",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "client",
            referencedColumnName: "id"
        }
   })
   clients: Clients[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
