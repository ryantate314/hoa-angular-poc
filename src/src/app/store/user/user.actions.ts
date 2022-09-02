import { createAction, props } from "@ngrx/store";
import { User } from "./../../models/user.model";

export const loadUser = createAction('[User] Load User');
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: any }>());
export const userNotFound = createAction('[User] Load User Not Found');
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: any }>());
export const createUser = createAction('[User] Create User', props<{ user: User }>());
export const createUserSuccess = createAction('[User] Create User Success', props<{ user: User }>());
export const createUserFailure = createAction('[User] Create User Failure', props<{ error: any }>());
export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[User] Delete User Success', props<{ id: string }>());
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: any }>());
