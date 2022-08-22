import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, timer, concatMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentPlan, Plot, PlotStatus } from '../models/plot.model';

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  constructor(private http: HttpClient) { }

  public getPlots(userId: string): Observable<Plot[]> {
    return timer(1000).pipe(concatMap(() => of([
      {
        id: "123456",
        street: "123 Test Street",
        city: "Maryville",
        state: "TN",
        zip: "37803",
        paymentPlan: PaymentPlan.Monthly,
        status: PlotStatus.Occupied
      }
    ])));
    return this.http.get<Plot[]>(`${environment.apiUrl}/plots?userId=${encodeURI(userId)}`);
  }
}
