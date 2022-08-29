import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { Plot } from '../models/plot.model';
import { AppState } from '../store/app-state';
import * as fromPlot from '../store/plot/';
import * as fromUser from '../store/user/';
import * as fromEvent from '../store/event';
import { loadPlots } from '../store/plot/';
import { Role, User } from '../models/user.model';
import { UserStatus } from '../store/user/';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Event } from '../models/event.model';
import { loadEvents } from '../store/event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  plots$: Observable<Plot[]>;
  plotsLoading$: Observable<boolean>;
  userLoading$: Observable<boolean>;
  isAuthenticated$: Observable<boolean>;
  private destroyed$ = new Subject<void>();
  user$: Observable<User | null>;

  eventsLoading$: Observable<boolean | null>;
  events$: Observable<Event[]>;

  constructor(private store: Store<AppState>,
    private router: Router,
    private authService: AuthService) {

    this.plots$ = this.store.pipe(select(fromPlot.selectAll)).pipe(
      filter(plots => plots !== null)
    );
    this.plotsLoading$ = this.store.pipe(select(fromPlot.arePlotsLoading));
    this.userLoading$ = this.store.pipe(select(fromUser.getUserLoading));
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.user$ = this.store.select(fromUser.getCurrentUser);
    this.eventsLoading$ = this.store.select(fromEvent.getIsLoading);
    this.events$ = this.store.select(fromEvent.selectAll).pipe(
      map(events => events.filter(x => x.endDate >= new Date()))
    );
  }

  ngOnInit(): void {
    this.user$.pipe(
      filter(x => x !== null),
      map(x => x!),
      takeUntil(this.destroyed$)
    ).subscribe((user) => {
      if (user.role === Role.Admin) {
        this.router.navigate(['/', 'admin']);
        return;
      }

      this.store.dispatch(loadPlots({ userId: user.id! }));
      this.store.dispatch(loadEvents());
    });

    this.store.select(fromUser.getUserStatus).pipe(
      filter(x => x === UserStatus.NOT_FOUND),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.router.navigate(["/", "onboarding"]);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

}
