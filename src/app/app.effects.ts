import { BibleService } from './services/bible.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadNuggetIds, loadNuggetIdsSuccess } from './reducers/bible.actions';
import { switchMap, map, tap, withLatestFrom, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from './reducers';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private bibleService: BibleService, private store:Store<State>) {}

  log = createEffect(() => this.actions$.pipe(
    tap(action => console.log(action))
  ), {dispatch: false});

  getBibleNuggetIds = createEffect(() => this.actions$.pipe(
    ofType(loadNuggetIds),
    withLatestFrom(this.store.select(selectNuggetIds)),
    //filter(([{payload}, orders]) => !!orders[payload.orderId]),
    switchMap(action => this.bibleService.getNuggetIdList()),
    map(nuggetIds => loadNuggetIdsSuccess({nuggetIds: nuggetIds}))
  ));
}
