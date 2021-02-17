import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { v4 as uuidV4 } from 'uuid';

@Entity({
    name: 'bank_accounts'
})
export class BankAccount {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    account_number: string;

    @Column()
    owner_name: string;

    @Column()
    balance: number;

    @Column({ type: 'timestamp' })
    created_at: Date;

    @BeforeInsert()
    generateId() {
        if (this.id) {
            return;
        }

        this.id = uuidV4();
    }

    @BeforeInsert()
    initBalance() {
        if (this.balance) {
            return;
        }

        this.balance = 0;
    }
}
