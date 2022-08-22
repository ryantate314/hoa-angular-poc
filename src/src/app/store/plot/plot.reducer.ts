import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Plot } from 'src/app/models/plot.model';
import { loadPlots, loadPlotsFailure, loadPlotsSuccess } from "./plot.actions";

export const FEATURE_NAME = "plot";

export interface PlotState extends EntityState<Plot> {
    plotsLoading: boolean;
    selectedPlot: string | null;
}

function sortByAddress(a: Plot, b: Plot) {
    return a.street.localeCompare(b.street);
}

export const entityAdapter: EntityAdapter<Plot> = createEntityAdapter<Plot>({
    selectId: (plot) => plot.id!,
    sortComparer: sortByAddress
});

export const initialState = entityAdapter.getInitialState({
    plotsLoading: false,
    selectedPlot: null
});

export const plotReducer = createReducer(initialState,
    on(loadPlots, state => ({
        ...state,
        plotsLoading: true
    })),
    on(loadPlotsSuccess, (state, action) => {
        const newState = entityAdapter.setAll(action.plots, state);
        return {
            ...newState,
            plotsLoading: false
        };
    }),
    on(loadPlotsFailure, state => ({
        ...state,
        plotsLoading: false
    }))
);
