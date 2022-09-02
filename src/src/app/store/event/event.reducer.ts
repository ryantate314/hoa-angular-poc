import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Event } from "src/app/models/event.model";
import { loadEvents, loadEventsSuccess } from "./event.actions";

export enum EventStatus {
    Initial = "Initial",
    Loading = "Loading",
    Loaded = "Loaded"
}

export interface EventState extends EntityState<Event> {
    status: EventStatus
}

export const entityAdapter = createEntityAdapter<Event>({
    selectId: x => x.id,
    sortComparer: (a, b) => a.startDate.getTime() - b.startDate.getTime()
});

const initialState = entityAdapter.getInitialState({
    status: EventStatus.Initial
});

export const eventReducer = createReducer<EventState>(initialState,
    on(loadEvents, (state) => ({
        ...state,
        status: EventStatus.Loading
    })),
    on(loadEventsSuccess, (state, action) => {
        const updatedState = entityAdapter.setAll(action.events, state);
        return {
            ...updatedState,
            status: EventStatus.Loaded
        };
    })
);