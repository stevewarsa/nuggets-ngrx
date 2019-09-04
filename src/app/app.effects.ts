import { BibleService } from './services/bible.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadNuggetIds, loadNuggetIdsSuccess } from './reducers/bible.actions';
import { switchMap, map, withLatestFrom, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from './reducers';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private bibleService: BibleService, private store:Store<State>) {}

  // the following effect responds to actions of type loadNuggetIds
  // but it only loads the data from the server (via http) if 
  // the nuggetIds in the store is empty:
  //    filter(([action, nuggetIds]) => nuggetIds.length === 0)
  getBibleNuggetIds = createEffect(() => this.actions$.pipe(
    ofType(loadNuggetIds),
    withLatestFrom(this.store.select(selectNuggetIds)),
    filter(([action, nuggetIds]) => nuggetIds.length === 0),
    switchMap(action => this.bibleService.getNuggetIdList()),
    map(nuggetIds => loadNuggetIdsSuccess({nuggetIds: nuggetIds}))
  ));
}
