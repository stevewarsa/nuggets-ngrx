import { loadNuggetIds, loadNuggetIdsSuccess } from './bible.actions';
import { createReducer, State, on } from '@ngrx/store';

export interface BibleState {
    nuggetIds: number[];
}

const initialState: BibleState = {
    nuggetIds: []
};

export const bibleReducer = createReducer(
    initialState,
    on(loadNuggetIds, state => ({...state, nuggetIds: undefined})),
    on(loadNuggetIdsSuccess, (state, action) => ({...state, nuggetIds: action.nuggetIds}))
);