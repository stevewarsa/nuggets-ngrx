import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from '../reducers';
import { map } from 'rxjs/operators';
import { loadNuggetIds } from '../reducers/bible.actions';

@Component({
  selector: 'nuggets-browse-bible-nuggets',
  templateUrl: './browse-bible-nuggets.component.html',
  styleUrls: ['./browse-bible-nuggets.component.css']
})
export class BrowseBibleNuggetsComponent implements OnInit {
  nuggetIds: number[] = [];

  constructor(private store:Store<State>) { }

  ngOnInit() {
    this.store.subscribe(x => {
      console.log("BrowseBibleNuggetsComponent - Here is the current state: ");
      console.log(x);
    });
    this.store.dispatch(loadNuggetIds());
    this.store.select(selectNuggetIds).subscribe(iDs => {
      if (iDs) {
        // the following shuffles the array.  In need to use slice first because
        // otherwise I'm modifying the order of the array in the store which
        // is not allowed because of NgRx strict mode.
        this.nuggetIds = iDs.slice().sort(() => Math.random() - 0.5)
      }
    });
  }
}
