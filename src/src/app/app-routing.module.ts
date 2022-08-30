import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { HomeComponent } from './pages/home/home.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { PlotsComponent } from './pages/plots/plots.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "onboarding", component: OnboardingComponent },
  { path: "plots", component: PlotsComponent },
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
