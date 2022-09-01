import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { StoreModule } from '@ngrx/store';
import { plotReducer } from './store/plot/plot.reducer';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './store/app-state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { PlotEffects } from './store/plot/plot.effects';
import { FAKE_BACKEND_INTERCEPTOR } from './interceptors/fake-back-end.interceptor';
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { UserEffects } from './store/user/user.effects';
import { EventEffects } from './store/event/event.effects';
import { TransactionEffects } from './store/transaction/transaction.effects';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PlotsComponent } from './pages/plots/plots.component';
import { PlotDetailsComponent } from './pages/plot-details/plot-details.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CreditCardInputComponent } from './components/credit-card-input/credit-card-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxMaskModule } from 'ngx-mask';
import { EventComponent } from './pages/event/event.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OnboardingComponent,
    ToolbarComponent,
    PlotsComponent,
    PlotDetailsComponent,
    PaymentComponent,
    LoadingComponent,
    CreditCardInputComponent,
    EventComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    AdminModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    FAKE_BACKEND_INTERCEPTOR
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
