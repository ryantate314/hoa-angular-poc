import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@app/store/app-state';
import { Store } from '@ngrx/store';
import { Observable, Subject, withLatestFrom } from 'rxjs';
import { combineLatest, filter, map, tap, switchMap, takeUntil } from 'rxjs';

import * as fromPlot from '@app/store/plot';
import * as fromUser from '@app/store/user';
import { Plot } from '@app/models/plot.model';
import { User } from '@app/models/user.model';
import { CreditCard } from '@app/models/credit-card.model';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { createTransaction, createTransactionSuccess } from '@app/store/transaction';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { Actions, ofType } from '@ngrx/effects';


function conditionalValidator(predicate: any, validator: any) {
  return ((formControl: AbstractControl) => {
    if (!formControl.parent) {
      return null;
    }
    if (predicate()) {
      return validator(formControl);
    }
    return null;
  })
}

enum AmountType {
  CurrentBalance = 'currentBalance',
  Other = 'other'
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

  plotId$: Observable<string>;
  plot$: Observable<Plot>;
  isLoading$: Observable<boolean>;
  user$: Observable<User>;

  creditCard$ = new Subject<CreditCard>;
  creditCardValid$ = new Subject<boolean>();
  creditCardValid: boolean = false;

  submit$ = new Subject<void>();

  destroyed$ = new Subject<void>();

  form: FormGroup;

  isSubmitting = false;

  amountType = AmountType;

  constructor(private store$: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private actions$: Actions) {

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

    this.isLoading$ = this.store$.select(fromPlot.arePlotsLoading);

    this.user$ = this.store$.select(fromUser.getCurrentUser).pipe(
      filter(x => x !== null),
      map(x => x!)
    );

    this.form = fb.group({
      'amountType': [AmountType.CurrentBalance],
      'amount': ['', [
        // Amount is required when AmountType is Other
        conditionalValidator(() =>
          this.isCustomAmount,
          Validators.required
        ),
        Validators.min(0.01)
      ]],
      'creditCard': [null]
    });

    this.form.get('amountType')!.valueChanges.subscribe(() => {
      this.form.get('amount')?.updateValueAndValidity();
    });

    this.submit$.pipe(
      switchMap(() => this.plot$),
      withLatestFrom(this.user$),
      takeUntil(this.destroyed$)
    ).subscribe(([plot, user]) => {

      const tran: Transaction = {
        userId: user.id!,
        amount: this.isCustomAmount ?
          this.form.get('amount')!.value
          : Math.abs(plot.accountBalance),
        description: 'Owner Payment',
        type: TransactionType.Credit,
        date: new Date()
      };

      this.store$.dispatch(
        createTransaction({
          plotId: plot.id!,
          transaction: tran
        })
      );
    });

    this.actions$.pipe(
      ofType(createTransactionSuccess),
      withLatestFrom(this.plot$),
      takeUntil(this.destroyed$)
    ).subscribe(([action, plot]) => {
      this.router.navigate(['/', 'plots', plot.id!]);
    });

  }

  getAdjustedAccountBalance(balance: number): number {
    if (balance > 0)
      return 0;
    return balance;
  }

  public get isCustomAmount() {
    return this.form.get('amountType')!.value === AmountType.Other;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onCancel() {
    this.location.back();
  }

  onSubmit() {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.submit$.next();
    }
  }

}
