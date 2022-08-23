import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService as Auth0Service, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated$: Observable<boolean>;
  public isLoading$: Observable<boolean>;

  constructor(private auth0: Auth0Service, private http: HttpClient) {
    this.isAuthenticated$ = this.auth0.isAuthenticated$;
    this.isLoading$ = this.auth0.isLoading$;
  }

  public login() {
    this.auth0.loginWithRedirect();
  }

  public logout() {
    this.auth0.logout();
  }

  public getUser(): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/users/login`, null);
  }
}
