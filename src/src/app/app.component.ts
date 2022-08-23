import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cmh.vmf.poc.hoa-angular';

  isAuthenticated$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.isLoading$ = this.authService.isLoading$;
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
