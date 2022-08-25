import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../store/app-state';
import { getUserLoading } from '../store/user';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  
  isLoading$: Observable<boolean>;

  constructor(private store$: Store<AppState>) {
    this.isLoading$ = this.store$.select(getUserLoading);
  }

  ngOnInit(): void {
  }

}
