import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { UserEffects } from './store/user/user.effects';
import { EventEffects } from './store/event/event.effects';
import { TransactionEffects } from './store/transaction/transaction.effects';
import { AdminModule } from './admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OnboardingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      PlotEffects,
      UserEffects,
      EventEffects,
      TransactionEffects
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    AuthModule.forRoot({
      ...environment.auth,
      httpInterceptor: {
        allowedList: [
          `${environment.apiUrl}/*`
        ]
      }
    }),
    AdminModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    FAKE_BACKEND_INTERCEPTOR
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
