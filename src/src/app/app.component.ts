import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { concat, concatMap, filter, Observable, Subject, take, takeUntil, withLatestFrom } from 'rxjs';
import { User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { AppState } from './store/app-state';
import * as fromUser from './store/user/';
import { loadUser, UserStatus } from './store/user/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cmh.vmf.poc.hoa-angular';

  isAuthenticated$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  private isDestroyed$ = new Subject<void>();
  userStatus$: Observable<UserStatus>;

  constructor(private authService: AuthService, private store$: Store<AppState>) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isLoading$ = this.authService.isLoading$;
    this.userStatus$ = this.store$.select(fromUser.getUserStatus);
  }

  ngOnInit(): void {
    // If the current user isn't found, look them up from the server.
    this.isAuthenticated$.pipe(
      filter(x => x === true),
      concatMap(() => this.userStatus$),
      filter(x => x === UserStatus.INITIAL),
      takeUntil(this.isDestroyed$)
    ).subscribe((userStatus) => {
      console.log("Loading user info");
      this.store$.dispatch(
        loadUser()
      );
    });
  }

  ngOnDestroy(): void {
    this.isDestroyed$.next();
  }


  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
