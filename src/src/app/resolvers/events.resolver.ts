import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AppState } from '@app/store/app-state';
import { EventStatus, getStatus, loadEvents } from '@app/store/event';
import { Store } from '@ngrx/store';
import { map, Observable, of, tap } from 'rxjs';

/**
 * Ensure the events are loaded if the user navigates directly to the event page or refreshes the page.
 */
@Injectable({
  providedIn: 'root'
})
export class EventsResolver implements Resolve<boolean> {

  constructor(private store$: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store$.select(getStatus).pipe(
      tap(status => {
        if (status === EventStatus.Initial)
          this.store$.dispatch(
            loadEvents()
          );
      }),
      map(_ => true)
    );
  }
}
