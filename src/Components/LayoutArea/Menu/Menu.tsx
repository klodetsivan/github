import react from "react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import { authStore } from "../../../Redux/AuthState";
import { vacationsStore } from "../../../Redux/VacationsState";
import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";
import "./Menu.css";

function Menu(): JSX.Element {

    const [user, setUser] = useState<UserModel>();

    useEffect(() => {

        setUser(authStore.getState().user)

        const unsubscribe = authStore.subscribe(() => {

            setUser(authStore.getState().user)
        })

        return () => {
            //to unsubscribe:
            unsubscribe();
        }

    }, []);
    return (
        <div className="Menu">

            {user && <NavLink to="/vacations">Vacations</NavLink>}

            {(user?.roleId === 'admin') && <NavLink to="/vacation/new"> | Add Vacation</NavLink>}
            {(user?.roleId === 'admin') && <NavLink to="/auth/reports"> | Reports</NavLink>}

            <AuthMenu />

        </div>
    );
}

export default Menu;
