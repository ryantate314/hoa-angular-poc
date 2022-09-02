import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '@app/store/app-state';
import { Store } from '@ngrx/store';

import * as fromTransaction from '@app/store/transaction';
import * as fromPlot from '@app/store/plot';
import { Observable, startWith, map, withLatestFrom, Subject, takeUntil, skipUntil, filter } from 'rxjs';
import { Transaction, TransactionType } from '@app/models/transaction.model';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Plot } from '@app/models/plot.model';
import { Actions, ofType } from '@ngrx/effects';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy, AfterViewInit {

  private dataSource: MatTableDataSource<Transaction>;
  dataSource$: Observable<MatTableDataSource<Transaction>>;
  plots$: Observable<Plot[]>;

  @ViewChild(MatSort) sort?: MatSort;

  isEditing: boolean = false;
  isSubmitting: boolean = false;
  destroyed$ = new Subject<void>();
  form: FormGroup;

  readonly transactionType = TransactionType;
  filteredPlotOptions$: Observable<Plot[]>;

  constructor(private store$: Store<AppState>, private fb: FormBuilder, private actions$: Actions) {
    this.dataSource = new MatTableDataSource<Transaction>();
    this.dataSource.sortingDataAccessor = (data: Transaction, sortHeaderId) => {
      switch(sortHeaderId) {
        case 'date':
          return data.date.getTime();
        default:
          return (data as any)[sortHeaderId];
      }
    };

    this.dataSource$ = this.store$.select(fromTransaction.selectAll).pipe(
      skipUntil(this.store$.select(fromTransaction.getIsLoading).pipe(
        filter(isLoading => isLoading === false)
      )),
      map(trans => {
        this.dataSource.data = trans;
        this.sort?.sort({ id: 'date', start: 'desc', disableClear: true });
        this.dataSource.sort = this.sort!
        return this.dataSource;
      })
    );

    this.plots$ = this.store$.select(fromPlot.selectAll);

    this.form = fb.group({
      'amount': [],
      'description': [],
      'type': [TransactionType.Debit],
      'plot': [null, [
        (control: AbstractControl) => typeof control.value === 'string' ?
          { 'autocomplete-required': true }
          : null
      ]]
    });

    this.filteredPlotOptions$ = this.form.get('plot')!.valueChanges.pipe(
      map(value => typeof value === 'string' ? value.toLowerCase() : value?.street),
      startWith(''),
      withLatestFrom(this.plots$),
      map(([searchTerm, plots]) => this.filterPlots(searchTerm, plots))
    );
  }

  ngAfterViewInit(): void {
    console.log('after view init', this.sort);
  }

  private filterPlots(searchTerm: string, plots: Plot[]): Plot[] {
    return plots.filter(
      plot => !searchTerm
        || plot.street.toLowerCase().includes(searchTerm)
        || plot.homeowners.some(owner =>
          (owner.firstName + " " + owner.lastName).toLowerCase().includes(searchTerm)
        )
    );
  }

  ngOnInit(): void {
    this.store$.dispatch(
      fromTransaction.loadTransactions({})
    );

    this.store$.dispatch(
      fromPlot.loadPlots({})
    );

    this.actions$.pipe(
      ofType(fromTransaction.createTransactionSuccess),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.isEditing = false;
      this.form.reset();
      this.isSubmitting = false;
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  displayPlot(plot: Plot): string {
    return plot && plot.street;
  }

  onEditClick() {
    this.isEditing = true;
  }

  onSubmit() {
    if (this.form.valid) {
      const transaction: Transaction = {
        amount: this.form.get('amount')!.value,
        date: new Date(),
        description: this.form.get('description')!.value,
        type: this.form.get('type')!.value,
        userId: null
      };

      const plot = this.form.get('plot')?.value as Plot;

      this.isSubmitting = true;

      this.store$.dispatch(
        fromTransaction.createTransaction({ transaction: transaction, plotId: plot.id! })
      );
    }
    
  }

}
