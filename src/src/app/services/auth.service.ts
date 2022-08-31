import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { filter, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated$: Observable<boolean>;
  public isLoading$: Observable<boolean>;

  constructor(private auth0: Auth0Service, private http: HttpClient) {
    this.isAuthenticated$ = this.auth0.isAuthenticated$;
    this.isLoading$ = this.auth0.isLoading$;

    //TODO update NgRx user whenever Auth0 user is updated
    // this.isAuthenticated$.pipe(
    //   filter(isAuthenticated => isAuthenticated)
    // ).subscribe()
  }

  public login() {
    this.auth0.loginWithRedirect();
  }

  public logout() {
    this.auth0.logout();
  }

  /**
   * Look up the currently logged in user based on their Auth0 session token
   * @returns 
   */
  public getCurrentUser(): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/login`, null);
  }
}
