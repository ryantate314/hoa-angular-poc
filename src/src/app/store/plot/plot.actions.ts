import { createAction, props } from '@ngrx/store';
import { Plot } from 'src/app/models/plot.model';

export const loadPlots = createAction('[Plot] Load Plots', props<{ userId: string }>());
export const loadPlotsSuccess = createAction('[Plot] Load Plots Success', props<{ plots: Plot[] }>());
export const loadPlotsFailure = createAction('[Plot] Load Plots Failure', props<{ error: any }>());
