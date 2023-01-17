import axios from "axios";
import CredentialsModel from "../Models/CredentialsModel";
import UserModel from "../Models/UserModel";
import { AuthActionType, authStore } from "../Redux/AuthState";
import appConfig from "../Utils/Config";

class AuthService {
    // register a new user 
    public async register(user: UserModel): Promise<void> {
        // send to backend the new user :
        const response = await axios.post<string>(appConfig.registerUrl, user);
        // backend returns token: 
        const token = response.data;
        // send token to redux: 
        authStore.dispatch({ type: AuthActionType.Register, payload: token })
    }

    // login existing user:
    public async login(Credentials: CredentialsModel): Promise<void> {
        // send to backend the Credentials 
        const response = await axios.post<string>(appConfig.loginUrl, Credentials);
        // backend returns token: 
        const token = response.data;
        // send token to redux: 
        authStore.dispatch({ type: AuthActionType.Login, payload: token })
    }

    // logout existing user 
    public logout(): void {
        authStore.dispatch({ type: AuthActionType.Logout })
    }


}

const authService = new AuthService();

export default authService;