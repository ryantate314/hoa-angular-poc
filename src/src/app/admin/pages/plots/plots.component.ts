import { Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import { AppState } from '@app/store/app-state';
import { getCurrentUser, selectAll as selectAllUsers } from '@app/store/user';
import { User } from '@app/models/user.model';
import { PaymentPlan, Plot, PlotStatus } from '@app/models/plot.model';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { createPlot, loadPlots, selectAll, createPlotSuccess, createPlotFailure } from '@app/store/plot';
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
  filteredOwners: Observable<string[]>;
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

    this.filteredOwners = this.ownerCtrl.valueChanges.pipe(
      startWith(null),
      map((owner: string | null) => 
        (owner ? this._filter(owner) : this.allOwners.slice())),
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

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    if(value) {
      this.owners.push(value);
    }

    event.chipInput!.clear();

    this.ownerCtrl.setValue(null);
  }

  remove(owner: string): void {
    const index = this.owners.indexOf(owner);

    if(index >= 0) {
      this.owners.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.owners.push(event.option.viewValue);
    this.ownerInput.nativeElement.value = '';
    this.ownerCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allOwners.filter(owner => owner.toLowerCase().includes(filterValue));
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
          homeowners: this.form.get('homeowners')!.value,
          accountBalance: 0
        }
      })
    );
  }

  ngOnInit(): void {
    this.store$.dispatch(
      loadPlots({})
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
