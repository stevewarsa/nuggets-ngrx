import { BibleService } from './services/bible.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { loadNuggetIds, loadNuggetIdsSuccess } from './reducers/bible.actions';
import { switchMap, map, tap } from 'rxjs/operators';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions, private bibleService: BibleService) {}

  log = createEffect(() => this.actions$.pipe(
    tap(action => console.log(action))
  ), {dispatch: false});

  getBibleNuggetIds = createEffect(() => this.actions$.pipe(
    ofType(loadNuggetIds),
    switchMap(action => this.bibleService.getNuggetIdList()),
    map(nuggetIds => loadNuggetIdsSuccess({nuggetIds: nuggetIds}))
  ));
}
