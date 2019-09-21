import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds, selectBiblePassageMap, selectMaxVerseByChapter, selectMaxChapterByBook } from '../reducers';
import { loadNuggetIds, loadNuggetText, loadMaxVerseByChapter, loadMaxChapterByBook } from '../reducers/bible.actions';
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
  maxVersesByChapter: {[bookName: string]: any[]} = {};
  maxChapterByBook: {[bookName: string]: number} = {};
  // start with index = -1 so that when incremented first time, it will be zero
  currentNuggetIndex: number = -1;
  currentPassageString: string = '';
  currentDisplayPassageString: string = '';
  currentPassage: Passage = null;
  currentFormattedPassageText: string = null;
  defaultTranslation: string = 'niv';
  showingChapter: boolean = false;
  cardContentHeight: string = null;

  constructor(private store:Store<State>) { }

  ngOnInit() {
    let adjustment;
    if (window.screen.width > 500) { // 768px portrait
      // this is desktop
      adjustment = 270;
    } else {
      adjustment = 253;
    }
    console.log("Here is the window.innerHeight: " + window.innerHeight);
    this.cardContentHeight = (window.innerHeight - adjustment) + '';
    // every time this component loads, dispatch an action to load the nugget id list
    // Note - the effect that catches this action will determine whether it needs to 
    // actually load the data via http from the server
    this.store.dispatch(loadNuggetIds({translation: this.defaultTranslation}));
    this.store.dispatch(loadMaxVerseByChapter({translation: this.defaultTranslation}));
    this.store.dispatch(loadMaxChapterByBook());
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
    this.store.select(selectMaxVerseByChapter).subscribe(maxVerseMap => {
      console.log('selectMaxVerseByChapter selector, here is the map:');
      console.log(maxVerseMap);
      if (maxVerseMap && Object.keys(maxVerseMap).length > 0) {
        this.maxVersesByChapter = maxVerseMap;
      }
    });
    this.store.select(selectMaxChapterByBook).subscribe(maxChapterArray => {
      console.log('selectMaxChapterByBook selector, here is the array:');
      console.log(maxChapterArray);
      if (maxChapterArray && maxChapterArray.length > 0) {
        maxChapterArray.forEach(maxChap => this.maxChapterByBook[maxChap.bookName] = maxChap.maxChapter);
      }
    });
  }

  showNextNugget() {
    if (this.currentNuggetIndex === (this.nuggetIds.length - 1)) {
      this.currentNuggetIndex = 0;
    } else {
      this.currentNuggetIndex += 1;
    }
    this.showingChapter = false;
    this.showNuggetText();
  }

  showPrevNugget() {
    if (this.currentNuggetIndex === 0) {
      this.currentNuggetIndex = this.nuggetIds.length - 1;
    } else {
      this.currentNuggetIndex -= 1;
    }
    this.showingChapter = false;
    this.showNuggetText();
  }

  showRandomNugget() {
    this.currentNuggetIndex = Math.floor(Math.random() * (this.nuggetIds.length - 1));
    this.showingChapter = false;
    this.showNuggetText();
  }

  showChapter() {
    let maxVerse: number = this.getMaxVerseForChapter(
      this.currentPassage.bookName, 
      this.currentPassage.chapter);
    let psg: Passage = {...this.currentPassage, 
      startVerse: 1, 
      endVerse: maxVerse
    };
    this.currentPassageString = PassageUtils.getPassageStringNoIndex(psg);
    this.currentDisplayPassageString = PassageUtils.getPassageString(psg, this.currentNuggetIndex, this.nuggetIds.length, this.defaultTranslation, true, false);
    this.showingChapter = true;
    this.currentPassage = null;
    this.currentFormattedPassageText = null;
    this.store.dispatch(loadNuggetText(psg));
  }

  private getMaxVerseForChapter(bookName: string, chapter: number): number {
    let maxVersesForBook: any[] = this.maxVersesByChapter[bookName];
    let maxVerseForChapterArray: number[] = maxVersesForBook
      .filter((chap: number[]) => chap[0] === chapter);
    let maxVerseForChapter: number = maxVerseForChapterArray[0][1];
    return maxVerseForChapter;
  }

  backToPassage() {
    this.showingChapter = false;
    this.showNuggetText();
  }

  private showNuggetText() {
    console.log('The current nugget index is ' + this.currentNuggetIndex + '. The current nugget id is: ' + this.nuggetIds[this.currentNuggetIndex]);
    let psg: Passage = this.passageKeysById[this.nuggetIds[this.currentNuggetIndex]];
    this.currentPassageString = PassageUtils.getPassageStringNoIndex(psg);
    this.currentDisplayPassageString = PassageUtils.getPassageString(psg, this.currentNuggetIndex, this.nuggetIds.length, this.defaultTranslation, true, true);
    this.currentPassage = null;
    this.currentFormattedPassageText = null;
    this.store.dispatch(loadNuggetText(psg));
  }
}
