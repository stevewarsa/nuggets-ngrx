import { State } from './../reducers/index';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadQuoteIds } from '../reducers/bible.actions';

@Component({
  selector: 'nuggets-browse-quotes',
  templateUrl: './browse-quotes.component.html',
  styleUrls: ['./browse-quotes.component.css']
})
export class BrowseQuotesComponent implements OnInit {

  constructor(private store:Store<State>) { }

  ngOnInit() {
    this.store.dispatch(loadQuoteIds({user: 'SteveWarsa'}));
  }
}
