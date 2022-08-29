import { createAction, props } from "@ngrx/store";
import { Transaction } from "src/app/models/transaction.model";

export const loadTransactions = createAction("[Transaction] Load", props<{ userId: string }>());
export const loadTransactionsSuccess = createAction("[Transaction] Load Transactions Success", props<{ transactions: Transaction[]}>());
export const loadTransactionsFailure = createAction("[Transaction] Load Transactions Failure", props<{ error: any }>());