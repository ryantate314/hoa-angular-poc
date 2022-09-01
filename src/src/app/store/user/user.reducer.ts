import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { User } from "src/app/models/user.model";
import * as actions from "./user.actions";

export const FEATURE_NAME = "plot"; //?

export enum UserStatus {
    INITIAL,
    LOADING,
    NOT_FOUND,
    FOUND,
    Error
}

export interface UserState extends EntityState<User> {
    currentUser: User | null,
    currentUserStatus: UserStatus
}

export const adapter = createEntityAdapter<User>({
    selectId: (user) => user.id!
});

const initialState = adapter.getInitialState({
    currentUser: null,
    currentUserStatus: UserStatus.INITIAL
});

export const userReducer = createReducer<UserState>(initialState,
    on(actions.loadUser, (state, action) => ({
        ...state,
        currentUserStatus: UserStatus.LOADING
    })),
    on(actions.loadUserSuccess, (state, action) => ({
        ...state,
        currentUser: action.user,
        currentUserStatus: action.user === null ? UserStatus.NOT_FOUND : UserStatus.FOUND
    })),
    on(actions.userNotFound, (state, action) => ({
        ...state,
        currentUser: null,
        currentUserStatus: UserStatus.NOT_FOUND
    })),
    on(actions.loadUsers, state => ({
        ...state,
        status: UserStatus.LOADING
    })),
    on(actions.loadUsersSuccess, (state, action) => {
        const newState = adapter.setAll(action.users, state);
        return {
            ...newState,
            status: UserStatus.FOUND
        };
    }),
    on(actions.loadUsersFailure, state => ({
        ...state,
        status: UserStatus.Error
    })),
);