import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Plot } from 'src/app/models/plot.model';
import { loadPlots, loadPlotsFailure, loadPlotsSuccess, createPlotSuccess, createPlotFailure } from "./plot.actions";

export const FEATURE_NAME = "plot";

export enum PlotStatus {
    Initial = "Initial",
    Loading = "Loading",
    Loaded = "Loaded",
    Failed = "Failed"
}

export interface PlotState extends EntityState<Plot> {
    status: PlotStatus;
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
    status: PlotStatus.Initial,
    selectedPlot: null
});

export const plotReducer = createReducer<PlotState>(initialState,
    on(loadPlots, state => ({
        ...state,
        status: PlotStatus.Loading
    })),
    on(loadPlotsSuccess, (state, action) => {
        const newState = entityAdapter.setAll(action.plots, state);
        return {
            ...newState,
            status: PlotStatus.Loaded
        };
    }),
    on(loadPlotsFailure, state => ({
        ...state,
        status: PlotStatus.Failed
    })),
    on(createPlotSuccess, (state, action) => {
        const newState = entityAdapter.addOne(action.plot, state);
        return {
            ...newState,
            status: PlotStatus.Loaded
        };
    }),
    on(createPlotFailure, state => ({
        ...state,
        status: PlotStatus.Failed
    })),
);
