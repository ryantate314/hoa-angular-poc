import { createAction, props } from '@ngrx/store';
import { Plot } from 'src/app/models/plot.model';

export const loadPlots = createAction('[Plot] Load Plots', props<{ userId?: string }>());
export const loadPlotsSuccess = createAction('[Plot] Load Plots Success', props<{ plots: Plot[] }>());
export const loadPlotsFailure = createAction('[Plot] Load Plots Failure', props<{ error: any }>());
export const createPlot = createAction('[Plot] Creat Plot', props<{ plot: Plot }>());
export const createPlotSuccess = createAction('[Plot] Creat Plot Success', props<{ plot: Plot }>());
export const createPlotFailure = createAction('[Plot] Creat Plot Failure', props<{ error: any }>());

