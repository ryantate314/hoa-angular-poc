import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from './guards/admin.guard';
import { EventsComponent } from './pages/events/events.component';
import { HomeComponent } from './pages/home/home.component';
import { PlotsComponent } from './pages/plots/plots.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      // URL: /admin/home
      { path: 'home', component: HomeComponent },
      // URL: /admin/plots/
      { path: 'plots', component: PlotsComponent},
      // URL: /admin/transactions
      { path: 'transactions', component: TransactionsComponent},
      // URL: /admin/events
      { path: 'events', component: EventsComponent},
      // URL: /admin/
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
