import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AppState } from '@app/store/app-state';
import { getPlotStatus, loadPlots, PlotStatus } from '@app/store/plot';
import { getCurrentUser } from '@app/store/user';
import { Store } from '@ngrx/store';
import { Observable, of, tap, map, filter, combineLatestWith } from 'rxjs';
import { User } from '@app/models/user.model';

/**
 * This resolver ensures that the plots are being loaded into state management.
 */
@Injectable({
  providedIn: 'root'
})
export class PlotsResolver implements Resolve<boolean> {

  constructor(private store$: Store<AppState>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user$ = this.store$.select(getCurrentUser).pipe(
      filter(user => user !== null),
      map(user => user!)
    );

    return this.store$.select(getPlotStatus).pipe(
      combineLatestWith(user$),
      tap(([status, user]) => {
        if (status === PlotStatus.Initial) {
          this.store$.dispatch(
            loadPlots({ userId: user.id! })
          );
        }
      }),
      map(_ => true)
    );
  }
}
