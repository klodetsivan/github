import { Navigate, Route, Routes } from "react-router-dom";
import LoginSignup from "../../AuthArea/LoginSignup/LoginSignup";
import Logout from "../../AuthArea/Logout/Logout";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import EditVacation from "../../VacationsArea/EditVacation/EditVacation";
import VacationApp from "../../VacationsArea/Vacations/VacationApp";
import VacationsReports from "../../VacationsArea/VacationsReports/VacationsReports";
import PageNotFound from "../PageNotFound/PageNotFound";
import "./Routing.css";

function Routing(): JSX.Element {
    return (
        <div className="Routing">
            <Routes>
                <Route path="/vacations" element={<VacationApp />} />
                <Route path="/vacation/new" element={<AddVacation />} />
                <Route path="/vacation/edit/:vacId" element={<EditVacation />} />
                <Route path="/auth/register" element={<LoginSignup />} />
                <Route path="/auth/login" element={<LoginSignup />} />
                <Route path="/auth/logout" element={<Logout />} />
                <Route path="/auth/reports" element={<VacationsReports />} />
                <Route path="/" element={<Navigate to="/auth/login" />} />
                <Route path="*" element={<PageNotFound />} />

            </Routes>
        </div>
    );
}

export default Routing;
