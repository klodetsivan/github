//1.auth state

import jwtDecode from "jwt-decode";
import { createStore } from "redux";
import UserModel from "../Models/UserModel";

export class AuthState {
    public token: string = null;
    public user: UserModel = null;

    // take token from sessionStorage, restore if exists:
    public constructor() {
        this.token = sessionStorage.getItem("token");
        // if exist 
        if (this.token) {
            // put in container 
            const container: { user: UserModel } = jwtDecode(this.token);
            // and update user 
            this.user = container.user;
        }
    }
}

//2.auth action type - actions we can perform

export enum AuthActionType {
    Register,
    Login,
    Logout
}

//3.auth action

export interface AuthAction {
    type: AuthActionType;
    payload?: string; //optional because logout needs no payload 
}

//4.auth reducer

export function AuthReducer(currentState = new AuthState(), action: AuthAction): AuthState {

    // duplicate current state 
    const newState = { ...currentState }

    // perform the needed operations 
    switch (action.type) {
        case AuthActionType.Register:
        case AuthActionType.Login:
            // take token 
            newState.token = action.payload;
            // save it to container 
            const container: { user: UserModel } = jwtDecode(newState.token);
            newState.user = container.user;
            sessionStorage.setItem("token", newState.token);

            break;

            // logout update token and user as null 
        case AuthActionType.Logout:
            newState.token = null;
            newState.user = null;
            sessionStorage.removeItem("token");
            break;

    }

    // return the new state 
    return newState;
}

//5.auth store
export const authStore = createStore(AuthReducer)