import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Role, User } from '@app/models/user.model';
import { AppState } from '@app/store/app-state';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { createUser, deleteUser, getCurrentUser, loadUsers, selectAll as selectAllUsers, createUserSuccess } from '@app/store/user';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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
  usersColumns: string[] = ['email','role','name','actions'];
  isUserCardVisible = false;
  form: FormGroup;
  destroyed$ = new Subject<void>();


  constructor(private store$: Store<AppState>, private fb: FormBuilder, private actions$: Actions, public dialog: MatDialog) { 
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

    this.actions$.pipe(
      ofType(createUserSuccess),
      takeUntil(this.destroyed$)
    ).subscribe(()=>{
      this.isUserCardVisible = false;
      this.form.reset();
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
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
  
  deleteUser(user: UserView) {
    let dialogRef = this.dialog.open(UsersDeleteDialog, {
      data: {
        user: user,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) this.store$.dispatch(
        deleteUser({
          id: user.id!
        })
      )
    })
  }


}

@Component({
  selector: 'users-delete-dialog',
  templateUrl: 'users.delete-dialog.html',
})
export class UsersDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<UsersDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
