import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { LoginGuard } from './guards/login.guard';
import { EventComponent } from './pages/event/event.component';
import { HomeComponent } from './pages/home/home.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { PlotDetailsComponent } from './pages/plot-details/plot-details.component';
import { PlotsComponent } from './pages/plots/plots.component';
import { EventsResolver } from './resolvers/events.resolver';
import { PlotsResolver } from './resolvers/plots.resolver';

const routes: Routes = [
  { path: "home", component: HomeComponent, canActivate: [ LoginGuard ] },
  { path: "onboarding", component: OnboardingComponent },
  {
    path: "plots",
    component: PlotsComponent,
    canActivate: [ AuthGuard ],
    resolve: [ PlotsResolver ]
  },
  {
    path: "plots/:id",
    component: PlotDetailsComponent,
    canActivate: [ AuthGuard ],
    resolve: [ PlotsResolver ]
  },
  {
    path: "plots/:id/payment",
    component: PaymentComponent,
    canActivate: [ AuthGuard ],
    resolve: [ PlotsResolver ]
  },
  {
    path: "events/:id",
    component: EventComponent,
    canActivate: [ AuthGuard ],
    resolve: [ EventsResolver ]
  },
  {
    path: "admin",
    canActivate: [ AuthGuard ],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: "", redirectTo: "home", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
