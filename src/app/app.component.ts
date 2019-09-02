import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, selectNuggetIds } from './reducers';
import { loadNuggetIds } from './reducers/bible.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'nuggets-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private store:Store<State>) {}

  ngOnInit(): void {
    this.store.subscribe(x => {
      console.log("AppComponent - Here is the current state: ");
      console.log(x);
    });
    this.store.dispatch(loadNuggetIds());
  }
}
