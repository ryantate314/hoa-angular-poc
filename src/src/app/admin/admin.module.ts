import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './admin.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { PlotsComponent } from './pages/plots/plots.component';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { SharedModule } from '@app/shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { MatSortModule } from '@angular/material/sort';
import { EventsComponent } from './pages/events/events.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    HomeComponent,
    AdminComponent,
    PlotsComponent,
    TransactionsComponent,
    EventsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    SharedModule,
    NgxMaskModule.forChild()
  ]
})
export class AdminModule { }
