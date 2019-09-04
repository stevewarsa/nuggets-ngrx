import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from '../reducers';
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
    // every time this component loads, dispatch an action to load the nugget id list
    // Note - the effect that catches this action will determine whether it needs to 
    // actually load the data via http from the server
    this.store.dispatch(loadNuggetIds());
    // use the selector to grab the nugget id list from the store
    this.store.select(selectNuggetIds).subscribe(iDs => {
      if (iDs) {
        // the following shuffles the array.  In need to use slice first because
        // otherwise I'm modifying the order of the array in the store which
        // is not allowed because of NgRx strict mode.  If I don't use slice, the 
        // error message is:
        //    TypeError: Cannot assign to read only property '0' of object '[object Array]'
        //    at Array.sort (<anonymous>)...
        this.nuggetIds = iDs.slice().sort(() => Math.random() - 0.5)
      }
    });
  }
}
