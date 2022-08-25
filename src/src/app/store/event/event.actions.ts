import { createAction, props } from "@ngrx/store";
import { Event } from "src/app/models/event.model";


export const loadEvents = createAction("[Event] Load Events");
export const loadEventsSuccess = createAction("[Event] Load Events Success", props<{ events: Event[] }>());
export const loadEventsFailure = createAction("[Event] Load Events Failure", props<{ error: any }>());