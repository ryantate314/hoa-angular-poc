import { Action, ActionReducer, ActionReducerMap } from "@ngrx/store";
import * as fromPlot from "./plot";
import * as fromUser from "./user";
import * as fromEvent from "./event";

export interface AppState {
    plot: fromPlot.PlotState,
    user: fromUser.UserState,
    event: fromEvent.EventState
}

export const reducers: ActionReducerMap<AppState> = {
    plot: fromPlot.plotReducer,
    user: fromUser.userReducer,
    event: fromEvent.eventReducer
};