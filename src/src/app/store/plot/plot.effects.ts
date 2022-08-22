import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { PlotService } from "src/app/services/plot.service";
import * as fromPlot from "src/app/store/plot";

@Injectable()
export class PlotEffects {

    constructor(private actions$: Actions, private plotService: PlotService) {}

    loadPlots$ = createEffect(() => this.actions$.pipe(
        ofType(fromPlot.loadPlots),
        switchMap(action => this.plotService.getPlots(action.userId)
            .pipe(
                map(plots => fromPlot.loadPlotsSuccess({ plots: plots })),
                catchError((error) => of(fromPlot.loadPlotsFailure({ error: error })))
            ))
    ));

}