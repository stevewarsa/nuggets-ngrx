import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Passage } from '../model/passage';

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  private _url:string = "/bible/api/";

  constructor(private httpService:HttpClient) { }
  
  public getPassagesById(translation: string): Observable<{[passageId: string]: Passage}> {
    console.log('BibleService.getPassagesById - calling ' + this._url + 'get_passage_id_list.php?translation=' + translation);
    return this.httpService.get<{[passageId: string]: Passage}>(this._url + 'get_passage_id_list.php?translation=' + translation);
  }

  public getPassage(passage: Passage): Observable<Passage> {
    console.log('BibleService.getPassage - calling ' + this._url + 'get_passage_text.php?translation=' + passage.translationName + '&book_id=' + passage.bookId + '&chapter=' + passage.chapter + '&start=' + passage.startVerse + '&end=' + passage.endVerse);
    return this.httpService.get<Passage>(this._url + 'get_passage_text.php?translation=' + passage.translationName + '&book_id=' + passage.bookId + '&chapter=' + passage.chapter + '&start=' + passage.startVerse + '&end=' + passage.endVerse);
  }
  
  public getMaxVerseByChapter(translation: string): Observable<{[bookName: string]: any[]}> {
    console.log('BibleService.getMaxVerseByChapter - calling ' + this._url + 'get_max_verse_by_book_chapter.php?translation=' + translation);
    return this.httpService.get<{[bookName: string]: any[]}>(this._url + 'get_max_verse_by_book_chapter.php?translation=' + translation);
  }
  
  public getMaxChapterByBook(): Observable<any[]> {
    console.log('BibleService.getMaxChapterByBook - calling ' + this._url + 'get_max_chapter_by_book.php');
    return this.httpService.get<any[]>(this._url + 'get_max_chapter_by_book.php');
  }
}
