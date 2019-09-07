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
    tap(val => console.log(val)),
    switchMap(val => {
      // Note - I expect the payload here to be a passage reference (e.g. 'john 3:16-18')
      // if (val.cache.hasOwnProperty(val.action.payload)) {
      //   return of(loadNuggetTextSuccess({passage: val.cache[val.action.payload]}));
      // } else {
      //   return this.bibleService.getPassage(null).pipe(
      //     tap(psg => val.cache[val.action.payload] = psg),
      //     map(psg =>
      //       loadNuggetTextSuccess({passage: psg})
      //     ),
      //     catchError(_err => EMPTY)
      //   );
      // }
      //return of(loadNuggetTextSuccess({passage: new Passage()}));
      return this.bibleService.getPassage(val.passage).pipe(
        //tap(psg => val.cache[val.action.payload] = psg),
        map(psg =>
          loadNuggetTextSuccess({passage: psg})
        ),
        catchError(_err => EMPTY)
      );
    })
  ));
}
