import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AppState } from '../store/app-state';
import * as fromUser from '../store/user';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  isAuthenticated$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  private isDestroyed$ = new Subject<void>();
  userStatus$: Observable<fromUser.UserStatus>;

  constructor(private authService: AuthService, private store$: Store<AppState>) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isLoading$ = this.authService.isLoading$;
    this.userStatus$ = this.store$.select(fromUser.getUserStatus);
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

}
