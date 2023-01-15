
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./LoginSignup.css";

function LoginSignup(): JSX.Element {

    const { register, handleSubmit } = useForm<any>();
    const location = useLocation();
    const isLogin = (location.pathname.substring(6) === "login");
    const navigate = useNavigate();
    const [user, setUser] = useState<UserModel>();

    useEffect(() => {
        const user = authStore.getState().user

        if (user) {
            setTimeout(() => {
                navigate('/vacations')
            }, 0)

            return
        }
        setUser(user)

        const unsubscribe = authStore.subscribe(() => {

            setUser(authStore.getState().user)
        })

        return () => {
            //to unsubscribe:
            unsubscribe();
        }

    }, []);

    async function send(user: UserModel) {
        try {
            if (isLogin) {
                await authService.login(user);
            }
            else {
                await authService.register(user);
            }
            notifyService.success("Welcome!");
            navigate("/vacations");
        }
        catch (err: any) {
            alert(err);
        }
    }


    if (user) return
    <div className="logged-in">
        <h1>You already logged in</h1>
    </div>

    return (

        <div className="LoginSignup Box">

            <form onSubmit={handleSubmit(send)}>

                <h2>{isLogin ? "Login" : "Signup"}</h2>

                {!isLogin && <>

                    <label>First Name:</label>
                    <input type="text" {...register("firstName")} required />

                    <label>Last Name:</label>
                    <input type="text" {...register("lastName")} required />

                </>}

                <label>Username:</label>
                <input type="text" {...register("username")} required />

                <label>Password:</label>
                <input type="password" {...register("password")} required />

                <button>{isLogin ? "Login" : "Signup"}</button>

                <NavLink to={(isLogin) ? "/auth/register" : "/auth/login"}>{(!isLogin) ? "Login" : "Signup"}</NavLink>
            </form>

        </div>
    );
}

export default LoginSignup;
