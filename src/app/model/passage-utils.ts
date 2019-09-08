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

  public static getPassageString(passage: Passage, currentIndex: number, passagesLen: number, transl: string, shortBook: boolean, showProgress: boolean, appendLetter?: string): string {
    let verseNumbers = null;
    if (passage.startVerse === passage.endVerse)
      verseNumbers = passage.startVerse;
    else
      verseNumbers =  passage.startVerse + "-" + passage.endVerse;

    if (appendLetter) {
      verseNumbers += appendLetter;
    }
    
    let bookName: string = shortBook ? this.getShortBook(passage.bookId) : this.getRegularBook(passage.bookId);
    let translString: string = "";
    if (transl) {
      translString = "<br/><span class='bible_version'>(" + transl + ")</span>";
    }
    if (showProgress) {
      return bookName + " " + passage.chapter + ":" + verseNumbers + translString + " - " + (currentIndex + 1) + " of " + passagesLen;
    } else {
      return bookName + " " + passage.chapter + ":" + verseNumbers + translString;
    }
  }

  public static getRegularBook(bookId: number) {
    let bookName = Constants.booksByNum[bookId];
    return Constants.bookAbbrev[bookName][1];
  }

  public static getShortBook(bookId: number) {
    let bookName = Constants.booksByNum[bookId];
    return Constants.bookAbbrev[bookName][0];
  }  
  public static getFormattedPassageText(passage: Passage, showVerseNumbers: boolean): string {
    let verseLen: number = passage.verses.length;
    let verseText: string = "";
    for (let i = 0; i < verseLen; i++) {
      let versePartLen: number = passage.verses[i].verseParts.length;
      for (let j = 0; j < versePartLen; j++) {
        if (j === 0 && showVerseNumbers) {
          verseText += "<span class='verse_num'>"
            + passage.verses[i].verseParts[j].verseNumber
            + "</span> ";
        }
        if (passage.verses[i].verseParts[j].wordsOfChrist) {
          verseText += "<span class='wordsOfChrist'>";
          verseText += passage.verses[i].verseParts[j].verseText
            + " ";
          verseText += "</span>";
        } else {
          verseText += passage.verses[i].verseParts[j].verseText
            + " ";
        }
      }
    }
    return verseText;
  }
}