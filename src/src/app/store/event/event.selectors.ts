import { createSelector } from "@ngrx/store";
import { AppState } from "../app-state";
import { entityAdapter } from "./event.reducer";

const selectFeature = (state: AppState) => state.event;

export const {
    selectAll
} = entityAdapter.getSelectors(selectFeature);

export const getIsLoading = createSelector(selectFeature, state => state.isLoading);