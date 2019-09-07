import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from '../reducers';
import { loadNuggetIds, loadNuggetText } from '../reducers/bible.actions';
import { Passage } from '../model/passage';

@Component({
  templateUrl: './browse-bible-nuggets.component.html',
  styleUrls: ['./browse-bible-nuggets.component.css']
})
export class BrowseBibleNuggetsComponent implements OnInit {
  nuggetIds: string[] = [];
  passageKeysById: {[passageId: string]: Passage};
  // start with index = -1 so that when incremented first time, it will be zero
  currentNuggetIndex: number = -1;
  defaultTranslation: string = 'niv';

  constructor(private store:Store<State>) { }

  ngOnInit() {
    // every time this component loads, dispatch an action to load the nugget id list
    // Note - the effect that catches this action will determine whether it needs to 
    // actually load the data via http from the server
    this.store.dispatch(loadNuggetIds({translation: this.defaultTranslation}));
    // use the selector to grab the nugget id list from the store
    this.store.select(selectNuggetIds).subscribe((iDs: {[passageId: string]: Passage}) => {
      if (iDs) {
        // the following shuffles the array.  In need to use slice first because
        // otherwise I'm modifying the order of the array in the store which
        // is not allowed because of NgRx strict mode.  If I don't use slice, the 
        // error message is:
        //    TypeError: Cannot assign to read only property '0' of object '[object Array]'
        //    at Array.sort (<anonymous>)...
        this.nuggetIds = Object.keys(iDs).sort(() => Math.random() - 0.5);
        if (this.nuggetIds && this.nuggetIds.length) {
          this.passageKeysById = iDs;
          this.showNextNugget();
        }
      }
    });
  }

  showNextNugget() {
    if (this.currentNuggetIndex === (this.nuggetIds.length - 1)) {
      this.currentNuggetIndex = 0;
    } else {
      this.currentNuggetIndex += 1;
    }
    this.showNuggetText();
  }

  showPrevNugget() {
    if (this.currentNuggetIndex === 0) {
      this.currentNuggetIndex = this.nuggetIds.length - 1;
    } else {
      this.currentNuggetIndex -= 1;
    }
    this.showNuggetText();
  }

  private showNuggetText() {
    console.log('The current nugget index is ' + this.currentNuggetIndex + '. The current nugget id is: ' + this.nuggetIds[this.currentNuggetIndex]);
    this.store.dispatch(loadNuggetText(this.passageKeysById[this.nuggetIds[this.currentNuggetIndex]]));
  }
}
