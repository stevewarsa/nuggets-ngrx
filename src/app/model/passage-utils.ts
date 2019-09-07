import { Constants } from './constants';
import { Passage } from './passage';

export class PassageUtils {
  public static getPassageStringNoIndex(passage: Passage) {
    var verseNumbers = null;
    if (passage.startVerse === passage.endVerse) {
      verseNumbers = passage.startVerse;
    } else {
      verseNumbers = passage.startVerse + "-" + passage.endVerse;
    }

    let regularBook: string = Constants.booksByNum[passage.bookId];
    return regularBook + " " + passage.chapter + ":" + verseNumbers + " (" + passage.translationId + ")";
  }
}