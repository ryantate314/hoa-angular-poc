import { User } from "@auth0/auth0-angular";
import { Plot } from "./plot.model";

export interface Transaction {
    id?: string;
    userId: string | null;
    type: TransactionType,
    amount: number;
    date: Date;
    description: string;
    user?: User;
    plot?: Plot;
}

export enum TransactionType {
    Credit = "Credit",
    Debit = "Debit"
}