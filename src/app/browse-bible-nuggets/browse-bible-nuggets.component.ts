import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from '../reducers';
import { map } from 'rxjs/operators';

@Component({
  selector: 'nuggets-browse-bible-nuggets',
  templateUrl: './browse-bible-nuggets.component.html',
  styleUrls: ['./browse-bible-nuggets.component.css']
})
export class BrowseBibleNuggetsComponent implements OnInit {
  nuggetIds$: Observable<number[]>;
  nuggetIdCount$: Observable<number>;

  constructor(private store:Store<State>) { }

  ngOnInit() {
    this.store.subscribe(x => {
      console.log("BrowseBibleNuggetsComponent - Here is the current state: ");
      console.log(x);
    });
    this.nuggetIds$ = this.store.select(selectNuggetIds);
    this.nuggetIdCount$ = this.nuggetIds$.pipe(
      map(nuggetIds => nuggetIds ? nuggetIds.length : 0)
    );
  }
}
