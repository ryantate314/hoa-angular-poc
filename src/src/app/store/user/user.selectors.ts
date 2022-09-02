import { state } from "@angular/animations";
import { createSelector } from "@ngrx/store";
import { AppState } from "../app-state";
import { UserState, UserStatus, adapter} from "./user.reducer";

export const featureSelector = (state: AppState) => state.user;

export const {
    selectAll,
    selectEntities
} = adapter.getSelectors(featureSelector);

export const getCurrentUser = createSelector(featureSelector, (state) => state.currentUser);
export const hasUserAccount = createSelector(featureSelector, (state) => state.currentUserStatus === UserStatus.FOUND);
export const getUserLoading = createSelector(featureSelector, (state) => state.currentUserStatus === UserStatus.LOADING);
export const getUserStatus = createSelector(featureSelector, (state) => state.currentUserStatus);

export const getUsersStatus = createSelector(featureSelector, (state) => state.status);
export const getUsersLoading = createSelector(getUsersStatus, status => status === UserStatus.LOADING);