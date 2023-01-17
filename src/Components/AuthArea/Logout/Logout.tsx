import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Logout.css";

function Logout(): JSX.Element {

    const navigate = useNavigate();

    useEffect(() => {
        //logout user
        authService.logout();

        notifyService.success("bye bye");

        navigate("/auth/login")

    }, []);

    return null

}

export default Logout;
