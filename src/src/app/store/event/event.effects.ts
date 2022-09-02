import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { EventService } from "src/app/services/event.service";
import * as fromEvent from "src/app/store/event";

@Injectable()
export class EventEffects {

    constructor(private actions$: Actions, private eventService: EventService) {}

    loadEvents$ = createEffect(() => this.actions$.pipe(
        ofType(fromEvent.loadEvents),
        switchMap(action => this.eventService.getEvents()
            .pipe(
                map(events => fromEvent.loadEventsSuccess({ events: events })),
                catchError((error) => of(fromEvent.loadEventsFailure({ error: error })))
            ))
    ));

    createEvent$ = createEffect(() => this.actions$.pipe(
        ofType(fromEvent.createEvent),
        switchMap(action => this.eventService.createEvent(action.event)
            .pipe(
                map(event => fromEvent.createEventSuccess({ event: event })),
                catchError((error) => of(fromEvent.createEventFailure({ error: error })))
            ))
    ));

    deleteEvent$ = createEffect(() => this.actions$.pipe(
        ofType(fromEvent.deleteEvent),
        switchMap(action => this.eventService.deleteEvent(action.eventId)
            .pipe(
                map(() => fromEvent.deleteEventSuccess({ eventId: action.eventId })),
                catchError((error) => of(fromEvent.deleteEventFailure({ error: error })))
            ))
    ));

}