import { createAction, props } from '@ngrx/store';

export const loadNuggetIds = createAction('Load Bible Nugget IDs');
export const loadNuggetIdsSuccess = createAction('Load Bible Nugget IDs Success', props<{nuggetIds: number[]}>());
