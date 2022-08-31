import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { AppState } from '@app/store/app-state';
import { getCurrentUser } from '@app/store/user';
import { User } from '@app/models/user.model';
import { Plot } from '@app/models/plot.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
//import { MatTable } from '@angular/material/table';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';

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
export class PlotsComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ownerCtrl = new FormControl('');
  filteredOwners: Observable<string[]>;
  owners: string[] = [];
  allOwners: string[] = ['Ryan', 'Chuck', 'Bob Marley']; // connect to data

  @ViewChild('ownerInput') ownerInput: ElementRef<HTMLInputElement> = {} as ElementRef;

  // plotsArray: Plot[] = []; // todo: add data.. shape data
  dataSource: PlotView[] = [
    {address: "123 test st", status: "Vacant", owners: "Bob Marley", balance: 420.00}
  ];
  plotsColumns: string[] = ['address', 'status', 'owners', 'balance'];

  user$: Observable<User | null>;

  constructor(private store$: Store<AppState>) {
    this.user$ = this.store$.select(getCurrentUser);

    this.filteredOwners = this.ownerCtrl.valueChanges.pipe(
      startWith(null),
      map((owner: string | null) => 
        (owner ? this._filter(owner) : this.allOwners.slice())),
    );
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

  ngOnInit(): void {
  }

}
