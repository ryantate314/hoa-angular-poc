import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { entityAdapter } from './transaction.reducer'


export const {
    selectAll
} = entityAdapter.getSelectors();

const selectFeature = (state: AppState) => state.transaction;

export const getIsLoading = createSelector(selectFeature, state => state.isLoading);