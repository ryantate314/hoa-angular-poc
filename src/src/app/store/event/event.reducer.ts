import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { Event } from "src/app/models/event.model";
import { loadEvents, loadEventsSuccess } from "./event.actions";

export interface EventState extends EntityState<Event> {
    isLoading: boolean | null
}

export const entityAdapter = createEntityAdapter<Event>({
    selectId: x => x.id,
    sortComparer: (a, b) => a.startDate.getTime() - b.startDate.getTime()
});

const initialState = entityAdapter.getInitialState({
    isLoading: null
});

export const eventReducer = createReducer<EventState>(initialState,
    on(loadEvents, (state) => ({
        ...state,
        isLoading: true
    })),
    on(loadEventsSuccess, (state, action) => {
        const updatedState = entityAdapter.setAll(action.events, state);
        return {
            ...updatedState,
            isLoading: false
        };
    })
);