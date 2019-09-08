import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds, selectBiblePassageMap } from '../reducers';
import { loadNuggetIds, loadNuggetText } from '../reducers/bible.actions';
import { Passage } from '../model/passage';
import { PassageUtils } from '../model/passage-utils';

@Component({
  templateUrl: './browse-bible-nuggets.component.html',
  styleUrls: ['./browse-bible-nuggets.component.css']
})
export class BrowseBibleNuggetsComponent implements OnInit {
  nuggetIds: string[] = [];
  passageKeysById: {[passageId: string]: Passage};
  cachedBiblePassages: {[passageRef: string]: Passage} = {};
  // start with index = -1 so that when incremented first time, it will be zero
  currentNuggetIndex: number = -1;
  currentPassageString: string = '';
  currentDisplayPassageString: string = '';
  currentPassage: Passage = null;
  currentFormattedPassageText: string = null;
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
        // the following shuffles the passage IDs array of keys of this map.  
        this.nuggetIds = Object.keys(iDs).sort(() => Math.random() - 0.5);
        if (this.nuggetIds && this.nuggetIds.length) {
          this.passageKeysById = iDs;
          this.showNextNugget();
        }
      }
    });
    this.store.select(selectBiblePassageMap).subscribe(psgMap => {
      this.cachedBiblePassages = psgMap;
      if (this.currentPassageString) {
        if (this.cachedBiblePassages.hasOwnProperty(this.currentPassageString)) {
          this.currentPassage = this.cachedBiblePassages[this.currentPassageString];
          console.log('Found passage "' + this.currentPassageString + '" in cachedBiblePassages:');
          console.log(this.currentPassage);
          this.currentFormattedPassageText = PassageUtils.getFormattedPassageText(this.currentPassage, true);
        } else {
          console.log('Unable to find passage "' + this.currentPassageString + '" in cachedBiblePassages...');
        }
      } else {
        console.log('No current passage string defined...');
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

  showRandomNugget() {
    this.currentNuggetIndex = Math.floor(Math.random() * (this.nuggetIds.length - 1));
    this.showNuggetText();
  }

  showChapter() {
    // TODO - need to find a way to show whole chapter
  }

  private showNuggetText() {
    console.log('The current nugget index is ' + this.currentNuggetIndex + '. The current nugget id is: ' + this.nuggetIds[this.currentNuggetIndex]);
    let psg: Passage = this.passageKeysById[this.nuggetIds[this.currentNuggetIndex]];
    this.currentPassageString = PassageUtils.getPassageStringNoIndex(psg);
    this.currentDisplayPassageString = PassageUtils.getPassageString(psg, this.currentNuggetIndex, this.nuggetIds.length, this.defaultTranslation, false, true);
    this.currentPassage = null;
    this.currentFormattedPassageText = null;
    this.store.dispatch(loadNuggetText(psg));
  }
}
