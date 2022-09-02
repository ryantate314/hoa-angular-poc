import { createAction, props } from "@ngrx/store";
import { Event } from "src/app/models/event.model";


export const loadEvents = createAction("[Event] Load Events");
export const loadEventsSuccess = createAction("[Event] Load Events Success", props<{ events: Event[] }>());
export const loadEventsFailure = createAction("[Event] Load Events Failure", props<{ error: any }>());

export const createEvent = createAction("[Event] Create Event", props<{ event: Event }>());
export const createEventSuccess = createAction("[Event] Create Event Success", props<{ event: Event }>());
export const createEventFailure = createAction("[Event] Create Events Failure", props<{ error: any }>());

export const deleteEvent = createAction("[Event] Delete Event", props<{ eventId: string }>());
export const deleteEventSuccess = createAction("[Event] Delete Event Success", props<{ eventId: string }>());
export const deleteEventFailure = createAction("[Event] Delete Event Failure", props<{ error: any }>());
