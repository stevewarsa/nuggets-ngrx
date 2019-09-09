import { createAction, props } from '@ngrx/store';
import { Passage } from '../model/passage';

export const loadNuggetIds = createAction('[Bible] Load Nugget IDs Request', props<{translation: string}>());
export const loadMaxVerseByChapter = createAction('[Bible] Load Max Verse By Chapter Request', props<{translation: string}>());
export const loadMaxVerseByChapterSuccess = createAction('[Bible] Load Max Verse By Chapter Success', props<{maxVerseByChapter: {[bookName: string]: any[]}}>());
export const loadNuggetIdsSuccess = createAction('[Bible] Load Nugget IDs Success', props<{passagesById: {[passageId: string]: Passage}}>());
export const loadNuggetText = createAction(
    '[Bible] Load Nugget Text Request', 
    (payload: Passage) => ({payload}));
export const loadNuggetTextSuccess = createAction('[Bible] Load Nugget Text Success', props<{passage: Passage, mapKey: string}>());
