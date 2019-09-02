import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from '../reducers';
import { loadNuggetIds } from '../reducers/bible.actions';

@Component({
  selector: 'nuggets-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  nuggetIds$: Observable<number[]>;

  constructor(private store:Store<State>) { }

  ngOnInit() {
    this.store.subscribe(x => {
      console.log("WelcomeComponent - Here is the current state: ");
      console.log(x);
    });
    this.nuggetIds$ = this.store.select(selectNuggetIds);
  }

}
