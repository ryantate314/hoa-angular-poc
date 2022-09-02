import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppState } from '@app/store/app-state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, filter, map, Observable, skipUntil, skipWhile, Subject, takeUntil, withLatestFrom } from 'rxjs';
import * as fromEvent from '@app/store/event';
import { Event } from '@app/models/event.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';

function sortByStartDate(events: Event[]): Event[] {
  return events.sort((a, b) =>
    a.startDate.getTime() - b.startDate.getTime());
}

interface EventWrapper extends Event {
  isDeleting: boolean;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, OnDestroy {

  public events$: Observable<Event[]>;

  public isEditing: boolean = false;
  public isSubmitting: boolean = false;

  public form: FormGroup;

  public minDate = new Date();

  @ViewChild(MatSort) sort?: MatSort;

  private deletedEvents: string[] = [];

  private destroyed$ = new Subject<void>();

  constructor(private store$: Store<AppState>, fb: FormBuilder, private actions$: Actions) {
    this.events$ = this.store$.select(fromEvent.selectAll).pipe(
      skipUntil(this.store$.select(fromEvent.getIsLoading).pipe(
        filter(isLoading => isLoading === false)
      )),
      map(sortByStartDate)
    );

    this.form = fb.group({
      'name': [],
      'location': [],
      'imageUrl': [],
      'eventStart': [],
      'eventEnd': [],
      'description': []
    });
  }

  ngOnInit(): void {
    this.store$.dispatch(
      fromEvent.loadEvents()
    );

    this.actions$.pipe(
      ofType(fromEvent.createEventSuccess),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.isEditing = false;
      this.isSubmitting = false;
      this.form.reset();
    })
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const event: Event = {
        description: this.form.get('description')!.value,
        endDate: this.form.get('eventEnd')!.value,
        startDate: this.form.get('eventStart')!.value,
        imageUrl: this.form.get('imageUrl')!.value,
        location: this.form.get('location')!.value,
        name: this.form.get('name')!.value
      };

      this.isSubmitting = true;
      this.store$.dispatch(
        fromEvent.createEvent({ event: event })
      );
    }
  }

  public onEditClick(): void {
    this.isEditing = true;
  }

  public delete(event: Event): void {
    this.store$.dispatch(
      fromEvent.deleteEvent({ eventId: event.id! })
    );

    this.deletedEvents.push(event.id!);
  }

  public isDeleting(event: Event): boolean {
    return this.deletedEvents.includes(event.id!);
  }

}
