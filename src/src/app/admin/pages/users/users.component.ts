import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role, User } from '@app/models/user.model';
import { AppState } from '@app/store/app-state';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { createUser, getCurrentUser, loadUsers, selectAll as selectAllUsers } from '@app/store/user';


export interface UserView {
  email: string;
  role: Role;
  name: string;
  id?: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  user$: Observable<User | null>;
  users$: Observable<UserView[]>;
  usersColumns: string[] = ['email','role','name','edit'];
  isUserCardVisible = false;
  form: FormGroup;


  constructor(private store$: Store<AppState>, private fb: FormBuilder, private actions$: Actions) { 
    this.users$ = this.store$.select(selectAllUsers).pipe(
      map(users=>
        users.map(user => ({
          email: user.email,
          role: user.role, 
          name: user.firstName+" "+user.lastName,
          id: user.id
        }))
      )
    );

    this.user$ = this.store$.select(getCurrentUser);

    this.form = this.fb.group({
      'firstName': [],
      'lastName': [],
      'email': [],
      'role': []
    });
  }

  ngOnInit(): void {
    this.store$.dispatch(
      loadUsers()
    )
  }

  submitNewUser(){
    this.store$.dispatch(
      createUser({
        user: {
          firstName: this.form.get('firstName')!.value,
          lastName: this.form.get('lastName')!.value,
          email: this.form.get('email')!.value,
          ssoId: null,
          role: this.form.get('role')!.value,
        }
      })
    );
  }



}
