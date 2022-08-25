import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiUrl}/events`).pipe(
      map(events => events.map(event => ({
        ...event,
        // Parse the date strings to dates
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      })))
    );
  }
}
