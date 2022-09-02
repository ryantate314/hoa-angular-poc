import { createSelector } from "@ngrx/store";
import { AppState } from "../app-state";
import { entityAdapter, EventStatus } from "./event.reducer";

const selectFeature = (state: AppState) => state.event;

export const {
    selectAll
} = entityAdapter.getSelectors(selectFeature);

export const getStatus = createSelector(selectFeature, state => state.status);

export const getIsLoading = createSelector(getStatus, status => status === EventStatus.Loading);

export const getEvent = (id: string) => 
    createSelector(
        selectFeature,
        state => state.entities[id]
    );