import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "../app-state";
import { entityAdapter, FEATURE_NAME, PlotStatus } from "./plot.reducer";

const selectFeature = (state: AppState) => state.plot;

export const {
    selectAll,
    selectEntities
} = entityAdapter.getSelectors(selectFeature);

export const getPlotStatus = createSelector(
    selectFeature,
    state => state.status
);

export const arePlotsLoading = createSelector(
    getPlotStatus,
    status => status === PlotStatus.Loading
);

export const getPlot = (id: string) => 
    createSelector(
        selectEntities,
        plots => plots[id] ?? null
    );