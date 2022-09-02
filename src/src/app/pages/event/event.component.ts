import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '@app/models/event.model';
import { AppState } from '@app/store/app-state';
import { EventStatus, getEvent, getIsLoading, getStatus } from '@app/store/event';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  event$: Observable<Event>;
  loading$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store$: Store<AppState>, private router: Router) {
    this.event$ = combineLatest([
      this.route.paramMap.pipe(
        map(params => params.get("id")!)
      ),
      this.store$.select(getStatus)
    ]).pipe(
      filter(([id, status]) => status === EventStatus.Loaded),
      switchMap(([id, status]) => this.store$.select(getEvent(id))),
      tap(event => {
        if (!event)
          this.router.navigate(['/']);
      }),
      filter(event => !!event),
      map(event => event!)
    );

    this.loading$ = this.store$.select(getIsLoading);
  }

  ngOnInit(): void {
  }



}
