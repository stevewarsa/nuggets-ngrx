import { selectMaxChapterByBook } from './reducers/index';
import { PassageUtils } from './model/passage-utils';
import { Constants } from './model/constants';
import { BibleService } from './services/bible.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadNuggetIds, loadNuggetIdsSuccess, loadNuggetText, loadNuggetTextSuccess, loadMaxVerseByChapter, loadMaxVerseByChapterSuccess, loadMaxChapterByBook, loadMaxChapterByBookSuccess } from './reducers/bible.actions';
import { switchMap, map, withLatestFrom, filter, tap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds, selectBiblePassageMap, selectMaxVerseByChapter } from './reducers';
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

  getMaxVerseByChapter = createEffect(() => this.actions$.pipe(
    ofType(loadMaxVerseByChapter),
    withLatestFrom(this.store.select(selectMaxVerseByChapter)),
    filter(([action, maxVerseByChapter]) => Object.keys(maxVerseByChapter).length === 0),
    tap(val => console.log(val)),
    map(([action, other]) => action.translation),
    switchMap(translation => this.bibleService.getMaxVerseByChapter(translation)),
    map(maxVerses => loadMaxVerseByChapterSuccess({maxVerseByChapter: maxVerses}))
  ));

  getMaxChapterByBook = createEffect(() => this.actions$.pipe(
    ofType(loadMaxChapterByBook),
    withLatestFrom(this.store.select(selectMaxChapterByBook)),
    filter(([action, maxChapterByBook]) => maxChapterByBook.length === 0),
    tap(val => console.log(val)),
    switchMap(() => this.bibleService.getMaxChapterByBook()),
    map(maxChapters => loadMaxChapterByBookSuccess({maxChapterByBook: maxChapters}))
  ));

  getBibleNuggetText = createEffect(() => this.actions$.pipe(
    ofType(loadNuggetText),
    withLatestFrom(this.store.select(selectBiblePassageMap)),
    tap(val => console.log(val)),
    map(([action, biblePassageMap]) => ({passage: action.payload, cache: biblePassageMap})),
    switchMap(val => {
      let passageString: string = PassageUtils.getPassageStringNoIndex(val.passage);
      console.log(passageString);
      // First check to see if this cache already has this passage, if so, return it
      // otherwise, need to call backend to get it (it will be cached in the reducer)
      if (val.cache.hasOwnProperty(passageString)) {
        return of(loadNuggetTextSuccess({passage: val.cache[passageString], mapKey: passageString}));
      } else {
        return this.bibleService.getPassage(val.passage).pipe(
          map(psg => {
            console.log("Returned from bibleService.getPassage (inside 'map') - here is the passage string: " + passageString + " and following is the passage returned:");
            console.log(psg);
            console.log("Here is val (inside 'map'):");
            console.log(val); 

            return loadNuggetTextSuccess({passage: psg, mapKey: passageString});
          }),
          catchError(_err => EMPTY)
        );
      }
    })
  ));
}
