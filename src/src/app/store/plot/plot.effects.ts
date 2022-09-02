import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from "rxjs/operators";
import { PlotService } from "src/app/services/plot.service";
import * as fromPlot from "src/app/store/plot";
import * as fromTransaction from "@app/store/transaction";
import * as fromUser from "@app/store/user";
import { Store } from "@ngrx/store";
import { AppState } from "../app-state";

@Injectable()
export class PlotEffects {

    constructor(private actions$: Actions, private plotService: PlotService, private store$: Store<AppState>) {}

    loadPlots$ = createEffect(() => this.actions$.pipe(
        ofType(fromPlot.loadPlots),
        switchMap(action => this.plotService.getPlots(action.userId)
            .pipe(
                map(plots => fromPlot.loadPlotsSuccess({ plots: plots })),
                catchError((error) => of(fromPlot.loadPlotsFailure({ error: error })))
            ))
    ));

    createPlot$ = createEffect(() => this.actions$.pipe(
        ofType(fromPlot.createPlot),
        switchMap(action => this.plotService.createPlot(action.plot)
            .pipe(
                map(plot => fromPlot.createPlotSuccess({ plot: plot })),
                catchError((error) => of(fromPlot.createPlotFailure({ error: error })))
            ))
    ));

    loadPlotsWhenTransactionUpdated$ = createEffect(() => this.actions$.pipe(
        ofType(fromTransaction.createTransactionSuccess),
        withLatestFrom(
            this.store$.select(fromUser.getCurrentUser).pipe(
                filter(user => user !== null),
                map(user => user!)
            )
        ),
        map(([action, user]) => fromPlot.loadPlots({ userId: user.id! }))
    ));

}