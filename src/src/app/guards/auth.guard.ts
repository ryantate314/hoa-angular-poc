import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppState } from '../store/app-state';
import { hasUserAccount } from '../store/user';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private hasUserAccount$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<AppState>, private router: Router) {
    this.hasUserAccount$ = this.store.select(hasUserAccount).pipe(
      filter(x => x !== null),
      map(x => x!)
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.isAuthenticated$.pipe(
        switchMap(isAuthenticated => {

          if (isAuthenticated) {
            // The user is authenticated with Auth0. Now see if they have a corresponding account.
            return this.hasUserAccount$.pipe(
              map(hasAccount => {
                if (!hasAccount) {
                  this.router.navigate(['/', 'onboarding']);
                  return false;
                }

                return true;
              })
            );
          }

          return of(false);
        })
      );
  } // canActivate()

}
