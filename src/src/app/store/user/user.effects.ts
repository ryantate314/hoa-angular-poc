import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { faPersonMilitaryPointing } from "@fortawesome/free-solid-svg-icons";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import * as fromUser from "src/app/store/user";
import { loadUserFailure, loadUsersFailure, loadUsersSuccess, loadUserSuccess, userNotFound, createUserFailure, createUserSuccess} from "src/app/store/user";

@Injectable()
export class UserEffects {

    constructor(private actions$: Actions, private authService: AuthService) {}

    loadUser$ = createEffect(() => this.actions$.pipe(
        ofType(fromUser.loadUser),
        switchMap(_ => {
            return this.authService.getCurrentUser().pipe(
                map(user => loadUserSuccess({ user: user })),
                catchError((err: HttpErrorResponse) => {
                    console.log(err);
                    if (err.status === 404) {
                        return of(userNotFound());
                    }
                    return of(loadUserFailure(err))
                })
            );
        }
        )
    ));

    loadUsers$ = createEffect(() => this.actions$.pipe(
        ofType(fromUser.loadUsers),
        switchMap(_ => {
            return this.authService.getUsers().pipe(
                map(users => loadUsersSuccess({ users: users })),
                catchError((err: HttpErrorResponse) => {
                    console.log(err);
                    return of(loadUsersFailure(err))
                })
            );
        }
        )
    ));

    createUser$ = createEffect(() => this.actions$.pipe(
        ofType(fromUser.createUser),
        switchMap(action => this.authService.createUser(action.user)
            .pipe(
                map(user => fromUser.createUserSuccess({ user: user })),
                catchError((error) => of(fromUser.createUserFailure({ error: error })))
            ))
    ));

}