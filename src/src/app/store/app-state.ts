import { Action, ActionReducer, ActionReducerMap } from "@ngrx/store";
import * as fromPlot from "./plot";
import * as fromUser from "./user";

export interface AppState {
    plot: fromPlot.PlotState,
    user: fromUser.UserState
}

export const reducers: ActionReducerMap<AppState> = {
    plot: <ActionReducer<fromPlot.PlotState, Action>>fromPlot.plotReducer,
    user: <ActionReducer<fromUser.UserState, Action>>fromUser.userReducer
};