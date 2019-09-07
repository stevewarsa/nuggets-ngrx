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
    on(loadNuggetIdsSuccess, (state, action) => ({...state, nuggetIds: action.passagesById})),
    on(loadNuggetTextSuccess, (state, action) => { 
        let passageMap = {...state.biblePassageMap};
        passageMap[action.mapKey] = action.passage;
        console.log("Here is the Bible Passage Map:");
        console.log(passageMap);
        return {...state, biblePassageMap: passageMap};
    })
);
