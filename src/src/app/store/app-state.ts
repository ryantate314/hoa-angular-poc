import { Action, ActionReducer, ActionReducerMap } from "@ngrx/store";
import * as fromPlot from "./plot";
import * as fromUser from "./user";
import * as fromEvent from "./event";
import * as fromTransaction from "./transaction";

export interface AppState {
    plot: fromPlot.PlotState,
    user: fromUser.UserState,
    event: fromEvent.EventState,
    transaction: fromTransaction.TransactionState
}

export const reducers: ActionReducerMap<AppState> = {
    plot: fromPlot.plotReducer,
    user: fromUser.userReducer,
    event: fromEvent.eventReducer,
    transaction: fromTransaction.transactionReducer
};