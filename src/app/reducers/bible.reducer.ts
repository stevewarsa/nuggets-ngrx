import { loadNuggetIdsSuccess, loadNuggetTextSuccess } from './bible.actions';
import { createReducer, on } from '@ngrx/store';
import { Passage } from '../model/passage';

export interface BibleState {
    nuggetIds: {[passageId: string]: Passage};
    // property that will contain bible verse text map
    biblePassageMap: {[passageRef: string]: Passage}
}

const initialState: BibleState = {
    nuggetIds: {},
    biblePassageMap: {}
};

export const bibleReducer = createReducer(
    initialState,
    on(loadNuggetIdsSuccess, (state, action) => ({...state, nuggetIds: action.passagesById}))
);


export const biblePassageMapReducer = createReducer(
    initialState,
    on(loadNuggetTextSuccess, (state, action) => ({...state, biblePassageMap: action.biblePassageCache}))
);