import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plot, PlotStatus } from '@app/models/plot.model';
import { AppState } from '@app/store/app-state';
import { Store } from '@ngrx/store';
import { map, Observable, tap, filter, switchMap, combineLatest, Subject, takeUntil, withLatestFrom } from 'rxjs';
import * as fromPlot from '@app/store/plot';
import * as fromTransaction from '@app/store/transaction';
import * as fromUser from '@app/store/user';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-plot-details',
  templateUrl: './plot-details.component.html',
  styleUrls: ['./plot-details.component.scss']
})
export class PlotDetailsComponent implements OnInit, OnDestroy {

  public user$: Observable<User>;
  private plotId$: Observable<string>;
  public plot$: Observable<Plot>;
  public otherOwners$: Observable<User[]>;
  public transactions$: Observable<Transaction[]>;

  public isLoading$: Observable<boolean>;

  private destroyed$ = new Subject<void>();

  public transType = TransactionType;

  constructor(private route: ActivatedRoute, private router: Router, private store$: Store<AppState>) {

    this.plotId$ = this.route.paramMap.pipe(
      map(x => x.get("id")),
      tap(plotId => {
        if (!plotId) {
          console.log("Bad request. Missing PlotId");
          this.router.navigate(['/', 'plots']);
        }
      }),
      filter(plotId => plotId !== null),
      map(plotId => plotId!)
    );

    this.plot$ = combineLatest([
      this.plotId$,
      this.store$.select(fromPlot.getPlotStatus)
    ]).pipe(
      // Wait until plots finish loading before redirecting and calling it not found
      filter(([plotId, status]) => status === fromPlot.PlotStatus.Loaded),
      switchMap(([plotId, status]) => this.store$.select(fromPlot.getPlot(plotId))),
      tap(plot => {
        if (plot === null) {
          console.log("Plot not found with id");
          this.router.navigate(['/', 'plots']);
        }
      }),
      filter(plot => plot !== null),
      map(plot => plot!)
    );

    this.isLoading$ = combineLatest([
      this.store$.select(fromPlot.arePlotsLoading),
      this.store$.select(fromTransaction.getIsLoading)
    ]).pipe(
      map(isLoading => isLoading.some(x => x))
    );

    this.transactions$ = this.store$.select(fromTransaction.selectAll);

    this.user$ = this.store$.select(fromUser.getCurrentUser).pipe(
      filter(user => user !== null),
      map(user => user!)
    );

    this.otherOwners$ = this.plot$.pipe(
      withLatestFrom(this.user$),
      map(([plot, user]) =>
        plot.homeowners.filter(owner =>
          owner.id !== user.id
        )
      )
    );
  }

  ngOnInit(): void {
    this.plotId$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(id => {
      this.store$.dispatch(fromTransaction.loadTransactions({ plotId: id }));
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

}
