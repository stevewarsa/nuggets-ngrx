import { BrowseQuotesComponent } from './browse-quotes/browse-quotes.component';
import { BrowseBibleNuggetsComponent } from './browse-bible-nuggets/browse-bible-nuggets.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';


const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'browse', component: BrowseBibleNuggetsComponent},
  {path: 'browsequotes', component: BrowseQuotesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
