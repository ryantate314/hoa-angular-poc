import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './guards/admin.guard';
import { HomeComponent } from './pages/home/home.component';
import { PlotsComponent } from './pages/plots/plots.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      // URL: /admin/home
      { path: 'home', component: HomeComponent },
      // URL: /admin/
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // URL: /admin/plots/
      { path: 'plots', component: PlotsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
