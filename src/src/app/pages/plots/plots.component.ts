import { Component, OnInit } from '@angular/core';
import { Plot } from '@app/models/plot.model';
import { AppState } from '@app/store/app-state';
import { arePlotsLoading, selectAll } from '@app/store/plot';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plots',
  templateUrl: './plots.component.html',
  styleUrls: ['./plots.component.scss']
})
export class PlotsComponent implements OnInit {

  plots$: Observable<Plot[]>;
  isLoading$: Observable<boolean>;

  constructor(private store$: Store<AppState>) {
    this.plots$ = this.store$.select(selectAll);
    this.isLoading$ = this.store$.select(arePlotsLoading);
  }

  ngOnInit(): void {
  }

}
