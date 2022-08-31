import { Component, OnInit } from '@angular/core';
import { Plot } from '@app/models/plot.model';
import { AppState } from '@app/store/app-state';
import { arePlotsLoading, selectAll } from '@app/store/plot';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Event } from '@app/models/event.model';

import * as fromEvent from '@app/store/event';

@Component({
  selector: 'app-plots',
  templateUrl: './plots.component.html',
  styleUrls: ['./plots.component.scss']
})
export class PlotsComponent implements OnInit {

  plots$: Observable<Plot[]>;
  isLoading$: Observable<boolean>;
  events$: Observable<Event[]>;

  constructor(private store$: Store<AppState>) {
    this.plots$ = this.store$.select(selectAll);
    this.events$ = this.store$.select(fromEvent.selectAll);
    this.isLoading$ = this.store$.select(arePlotsLoading);
  }

  ngOnInit(): void {
    this.store$.dispatch(
      fromEvent.loadEvents()
    );
  }

}
