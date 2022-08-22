import { Action, ActionReducer, ActionReducerMap } from "@ngrx/store";
import * as fromPlot from "./plot";

export interface AppState {
    [fromPlot.FEATURE_NAME]: fromPlot.PlotState
}

export const reducers: ActionReducerMap<AppState> = {
    [fromPlot.FEATURE_NAME]: <ActionReducer<fromPlot.PlotState, Action>>fromPlot.plotReducer
};