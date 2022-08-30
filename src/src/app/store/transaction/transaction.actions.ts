import { createAction, props } from "@ngrx/store";
import { Transaction } from "src/app/models/transaction.model";

export const loadTransactions = createAction("[Transaction] Load", props<{ plotId: string }>());
export const loadTransactionsSuccess = createAction("[Transaction] Load Transactions Success", props<{ transactions: Transaction[]}>());
export const loadTransactionsFailure = createAction("[Transaction] Load Transactions Failure", props<{ error: any }>());

export const createTransaction = createAction("[Transaction] Create", props<{ plotId: string, transaction: Transaction }>());
export const createTransactionSuccess = createAction("[Transaction] Create Success", props<{ transaction: Transaction }>());
export const createTransactionFailure = createAction("[Transaction] Create Failure", props<{ error: any }>());