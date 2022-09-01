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

  public getPlots(userId?: string): Observable<Plot[]> {
    return this.http.get<Plot[]>(`${environment.apiUrl}/plots`, {
      params: {
        userId: userId ?? ''
      }
    });
  }
}
