import { Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { AppState } from '@app/store/app-state';
import { getCurrentUser, loadUsers, selectAll as selectAllUsers } from '@app/store/user';
import { User } from '@app/models/user.model';
import { PaymentPlan, Plot, PlotStatus } from '@app/models/plot.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, withLatestFrom } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, skipUntil, startWith, takeUntil, filter } from 'rxjs/operators';
import { createPlot, loadPlots, selectAll, createPlotSuccess, createPlotFailure, arePlotsLoading } from '@app/store/plot';
import { Actions, ofType } from '@ngrx/effects';

export interface PlotView {
  address: string;
  status: string;
  owners: string;
  balance: number;
}

@Component({
  selector: 'app-plots',
  templateUrl: './plots.component.html',
  styleUrls: ['./plots.component.scss']
})
export class PlotsComponent implements OnInit, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ownerCtrl = new FormControl('');
  filteredOwners$: Observable<User[]>;
  owners: User[] = [];
  allOwners$: Observable<User[]>;
  isPlotCardVisible = false;
  plots$: Observable<PlotView[]>;
  plotsColumns: string[] = ['address', 'status', 'owners', 'balance'];
  form: FormGroup;
  destroyed$ = new Subject<void>();

  @ViewChild('ownerInput') ownerInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  user$: Observable<User | null>;

  constructor(private store$: Store<AppState>, private fb: FormBuilder, private  actions$: Actions) {
    this.plots$ = this.store$.select(selectAll).pipe(
      skipUntil(this.store$.select(arePlotsLoading).pipe(
        filter(isLoading => !isLoading)
      )),
      map(plots => 
        plots.map(plot => ({
          address: plot.street,
          status: plot.status,
          owners: plot.homeowners.map(owner => owner.firstName+" "+owner.lastName).join(", "),
          balance: plot.accountBalance
        })
      ))
    );
    this.user$ = this.store$.select(getCurrentUser);

    this.allOwners$ = this.store$.select(selectAllUsers);

    this.filteredOwners$ = this.ownerCtrl.valueChanges.pipe(
      map((value: string | User | null) => typeof value === 'string' ? value.toLowerCase() : value?.firstName+" "+value?.lastName),
      startWith(null),
      withLatestFrom(this.allOwners$),
      map(([searchTerm, owners ]) => 
        (searchTerm ? this._filter(searchTerm, owners) : owners.slice())),
    );


    this.form = this.fb.group({
      'street': [],
      'city': [],
      'state': [],
      'zip': [],
      'status': [PlotStatus.Occupied],
      'paymentPlan': [PaymentPlan.Monthly],
      'homeowners': [],
    });
  }

  displayOwner(user: User): string {
    return user && user.firstName+" "+user.lastName;
  }

  remove(owner: User): void {
    const index = this.owners.indexOf(owner);

    if(index >= 0) {
      this.owners.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.owners.push(event.option.value);
    this.ownerInput.nativeElement.value = '';
    this.ownerCtrl.setValue(null);
  }

  private _filter(value: string, owners: User[]): User[] {
    const filterValue = value.toLowerCase();

    return owners.filter(owner => (owner.firstName+" "+owner.lastName).toLowerCase().includes(filterValue));
  }

  submitNewPlot(){
    this.store$.dispatch(
      createPlot({
        plot: {
          street: this.form.get('street')!.value,
          city: this.form.get('city')!.value,
          state: this.form.get('state')!.value,
          zip: this.form.get('zip')!.value,
          status: this.form.get('status')!.value,
          paymentPlan: this.form.get('paymentPlan')!.value,
          homeowners: this.owners,
          accountBalance: 0
        }
      })
    );
  }

  ngOnInit(): void {
    this.store$.dispatch(
      loadPlots({})
    );

    this.store$.dispatch(
      loadUsers()
    );

    this.actions$.pipe(
      ofType(createPlotSuccess),
      takeUntil(this.destroyed$)
    ).subscribe(()=>{
      this.isPlotCardVisible = false;
      this.form.reset();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

}
