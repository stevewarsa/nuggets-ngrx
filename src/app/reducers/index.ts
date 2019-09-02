import { BibleState, bibleReducer } from './bible.reducer';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
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

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
