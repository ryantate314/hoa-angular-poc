export interface Transaction {
    id?: string;
    userId: string;
    type: TransactionType,
    amount: number;
    date: Date;
    description: string;
}

export enum TransactionType {
    Credit = "Credit",
    Debit = "Debit"
}