import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BibleService {
  private _url:string = "/bible/api/";

  constructor(private httpService:HttpClient) { }
  
  public getNuggetIdList(): Observable<number[]> {
    console.log('BibleService.getNuggetIdList - calling ' + this._url + 'get_nugget_id_list.php');
    return this.httpService.get<any[]>(this._url + 'get_nugget_id_list.php');
  }
}
