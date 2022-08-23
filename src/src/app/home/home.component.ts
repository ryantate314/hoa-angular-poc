import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, Observable } from 'rxjs';
import { Plot } from '../models/plot.model';
import { AppState } from '../store/app-state';
import * as fromPlot from '../store/plot/';
import { loadPlots } from '../store/plot/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  plots$: Observable<Plot[]>;
  plotsLoading$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.plots$ = this.store.pipe(select(fromPlot.selectAll)).pipe(
      filter(plots => plots !== null)
    );
    this.plotsLoading$ = this.store.pipe(select(fromPlot.arePlotsLoading));
  }

  ngOnInit(): void {
    this.store.dispatch(loadPlots({ userId: "846516891" }));
  }

}
