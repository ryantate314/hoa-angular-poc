import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { PlotService } from "src/app/services/plot.service";
import { TransactionService } from "src/app/services/transaction.service";
import * as fromTransaction from "src/app/store/transaction";

@Injectable()
export class TransactionEffects {

    constructor(private actions$: Actions, private transactionService: TransactionService) {}

    loadPlots$ = createEffect(() => this.actions$.pipe(
        ofType(fromTransaction.loadTransactions),
        switchMap(action => this.transactionService.getTransactions(action.userId)
            .pipe(
                map(transactions => fromTransaction.loadTransactionsSuccess({ transactions: transactions })),
                catchError((error) => of(fromTransaction.loadTransactionsFailure({ error: error })))
            ))
    ));

}