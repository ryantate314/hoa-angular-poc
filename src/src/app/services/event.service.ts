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
      map(events => events.map(this.parseEvent))
    );
  }

  public createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(
      `${environment.apiUrl}/events`,
      event
    ).pipe(
      map(this.parseEvent)
    );
  }

  private parseEvent(event: Event): Event {
    return {
      ...event,
      // Parse the date strings to dates
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    };
  }

  public deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/events/${eventId}`
    );
  }
}
