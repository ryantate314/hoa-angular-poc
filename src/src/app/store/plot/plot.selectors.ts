import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../app-state";
import { entityAdapter, FEATURE_NAME } from "./plot.reducer";

const selectFeature = (state: AppState) => state.plot;

export const {
    selectAll
} = entityAdapter.getSelectors(selectFeature);

export const arePlotsLoading = createSelector(
    selectFeature,
    (state) => state.plotsLoading
);