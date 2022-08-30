import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Transaction } from "src/app/models/transaction.model";
import { createTransactionSuccess, loadTransactions, loadTransactionsSuccess } from "./transaction.actions";


export interface TransactionState extends EntityState<Transaction> {
    isLoading: boolean;
}

export const entityAdapter = createEntityAdapter<Transaction>({
    selectId: (trans) => trans.id!,
    sortComparer: (a, b) => a.date.getTime() - b.date.getTime()
});

const initialState = entityAdapter.getInitialState({
    isLoading: false
});

export const transactionReducer = createReducer<TransactionState>(initialState,
    on(loadTransactions, (state, action) => ({
        ...state,
        isLoading: true
    })),
    on(loadTransactionsSuccess, (state, action) => ({
        ...entityAdapter.setAll(action.transactions, state),
        isLoading: false
    })),
    on(createTransactionSuccess, (state, action) => ({
        ...entityAdapter.addOne(action.transaction, state)
    }))
);