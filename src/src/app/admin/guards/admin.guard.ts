import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { Role } from '../../models/user.model';
import { AppState } from '../../store/app-state';
import { getCurrentUser } from '../../store/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private store$: Store<AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.isAdmin();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
    return this.isAdmin();
  }

  private isAdmin(): Observable<boolean> {
    return this.store$.select(getCurrentUser).pipe(
      filter(x => x !== null),
      map(user => {

        if (user!.role !== Role.Admin) {
          console.log("User is not an administrator");
          this.router.navigate(['/']);
          return false;
        }

        return true;
      })
    );
  }
  
}
