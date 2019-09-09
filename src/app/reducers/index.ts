import { BibleState, bibleReducer } from './bible.reducer';
import {
  ActionReducerMap,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

export interface State {
  bible: BibleState;
}

export const reducers: ActionReducerMap<State> = {
  bible: bibleReducer
};

export const selectBible = (state: State) => state.bible;
 
export const selectNuggetIds = createSelector(
  selectBible,
  (state: BibleState) => state.nuggetIds
);
 
export const selectMaxVerseByChapter = createSelector(
  selectBible,
  (state: BibleState) => state.maxVerseByChapter
);
 
export const selectBiblePassageMap = createSelector(
  selectBible,
  (state: BibleState) => state.biblePassageMap
);

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
