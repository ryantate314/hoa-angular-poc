import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated$: Observable<boolean>;

  constructor(private auth0: Auth0Service) {
    this.isAuthenticated$ = this.auth0.isAuthenticated$;
  }

  public login() {
    this.auth0.loginWithRedirect();
  }

  public logout() {
    this.auth0.logout();
  }
}
