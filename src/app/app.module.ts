import { BibleService } from './services/bible.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { HttpClientModule } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatButtonModule } from  '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BrowseBibleNuggetsComponent } from './browse-bible-nuggets/browse-bible-nuggets.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    BrowseBibleNuggetsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true
      }
    }),
    EffectsModule.forRoot([AppEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [BibleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
