import { Verse } from './verse';

export class Passage {
    bookId: number;
    bookName: string;
    translationId: string;
    translationName: string;
    chapter: number;
    startVerse: number;
    endVerse: number;
    verses: Verse[];
}

