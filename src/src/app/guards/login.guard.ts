import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { AppState } from '@app/store/app-state';
import { Store } from '@ngrx/store';
import { iif, map, Observable, switchMap, of, filter } from 'rxjs';

import * as fromUser from "@app/store/user";
import { Role } from '@app/models/user.model';

/**
 * Routes protected with this guard are off-limits if the user is already logged in.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private authService: AuthService, private store$: Store<AppState>, private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.isAuthenticated$.pipe(
        switchMap(isAuthenticated => iif(
          () => isAuthenticated,
          // The user is authenticated with Auth0. Redirect them to the appropriate home page.
          this.store$.select(fromUser.getCurrentUser).pipe(
            filter(user => user !== null),
            map(user => user!),
            map(user => {
              if (user.role == Role.Admin)
                this.router.navigate(['/', 'admin']);
              else
                this.router.navigate(['/', 'plots']);
              return false;
            })
          ),
          of(true)
        ))
      );
  }
  
}
