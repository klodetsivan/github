import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import "./AuthMenu.css";

function AuthMenu(): JSX.Element {

    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        // get user state from redux
        setUser(authStore.getState().user)

        const unsubscribe = authStore.subscribe(()=>{
            setUser(authStore.getState().user)
        })

        return ()=>{
            unsubscribe()
        }
    }, [])


    return (
        <div className="AuthMenu">
            {!user && <>
                <span>Hello Guest |</span>
                <NavLink to="/auth/login">Login</NavLink>
                <span>|</span>
                <NavLink to="/auth/register">Signup</NavLink>
            </>}
            {user && <>
                <span>Hello {user.firstName} {user.lastName} |</span>
                <NavLink to="/auth/logout">Logout</NavLink>
            </>}
        </div>
    );
}

export default AuthMenu;
