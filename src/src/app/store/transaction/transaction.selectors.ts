import { createSelector } from '@ngrx/store';
import { AppState } from '../app-state';
import { entityAdapter } from './transaction.reducer'

const selectFeature = (state: AppState) => state.transaction;


export const {
    selectAll
} = entityAdapter.getSelectors(selectFeature);


export const getIsLoading = createSelector(selectFeature, state => state.isLoading);