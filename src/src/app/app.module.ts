import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { plotReducer } from './store/plot/plot.reducer';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './store/app-state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { PlotEffects } from './store/plot/plot.effects';
import { FAKE_BACKEND_INTERCEPTOR } from './interceptors/fake-back-end.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      PlotEffects
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [
    FAKE_BACKEND_INTERCEPTOR
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
