import { PassageUtils } from './model/passage-utils';
import { Constants } from './model/constants';
import { BibleService } from './services/bible.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadNuggetIds, loadNuggetIdsSuccess, loadNuggetText, loadNuggetTextSuccess } from './reducers/bible.actions';
import { switchMap, map, withLatestFrom, filter, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds, selectBiblePassageMap } from './reducers';
import { of, EMPTY } from 'rxjs';
import { Passage } from './model/passage';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private bibleService: BibleService, private store:Store<State>) {}

  // the following effect responds to actions of type loadNuggetIds
  // but it only loads the data from the server (via http) if 
  // the nuggetIds in the store is empty:
  //    filter(([action, nuggetIds]) => Object.keys(nuggetIds).length === 0)
  getBibleNuggetIds = createEffect(() => this.actions$.pipe(
    ofType(loadNuggetIds),
    withLatestFrom(this.store.select(selectNuggetIds)),
    filter(([action, nuggetIds]) => Object.keys(nuggetIds).length === 0),
    tap(val => console.log(val)),
    map(([action, other]) => action.translation),
    switchMap(action => this.bibleService.getPassagesById(action)),
    map(nuggetIds => loadNuggetIdsSuccess({passagesById: nuggetIds}))
  ));

  getBibleNuggetText = createEffect(() => this.actions$.pipe(
    ofType(loadNuggetText),
    withLatestFrom(this.store.select(selectBiblePassageMap)),
    tap(val => console.log(val)),
    map(([action, biblePassageMap]) => ({passage: action.payload, cache: biblePassageMap})),
    switchMap(val => {
      let passageString: string = PassageUtils.getPassageStringNoIndex(val.passage);
      console.log(passageString);
      if (val.cache.hasOwnProperty(passageString)) {
        return of(loadNuggetTextSuccess({passage: val.cache[passageString], biblePassageCache: val.cache}));
      } else {
        return this.bibleService.getPassage(val.passage).pipe(
          tap(psg => {
            val.cache[passageString] = psg;
            console.log(val.cache);
          }),
          map(psg =>
            loadNuggetTextSuccess({passage: psg, biblePassageCache: val.cache})
          ),
          catchError(_err => EMPTY)
        );
      }
    })
  ));
}
