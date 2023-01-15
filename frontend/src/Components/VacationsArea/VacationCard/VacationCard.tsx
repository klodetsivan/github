import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import appConfig from "../../../Utils/Config";
import "./VacationCard.css";

interface VacationCardProps {
    vacation: VacationModel;
    user: UserModel;
    deleteVacation: (vacationId: number) => void;
    followToggle: (vacationId: number) => void;
    unFollowToggle: (vacationId: number) => void;
}

function VacationCard(props: VacationCardProps): JSX.Element {

    function onFollowToggle() {
        console.log('click');

        const { vacationId } = props.vacation
        if (props.vacation.isFollowing) {
            props.unFollowToggle(vacationId);
        } else {
            props.followToggle(vacationId);
        }
    }

    return (
        <div className="VacationCard Box">

            {/* if user => show button follow */}
            {(props.user.roleId === "user") &&
                <button
                    className={(props.vacation.isFollowing === 1) ? "following" : ""}
                    onClick={onFollowToggle}>{(!props.vacation.isFollowing) ? 'Follow' : 'UnFollow'}
                </button>}

            <span>Destination: {props.vacation.destination}</span>
            <br />
            {props.vacation.imageName &&
                <img crossOrigin="anonymous" src={appConfig.vacationsImagesUrl + props.vacation.imageName} />
            }
            <br /><br />
            <div className="description">
                <span>Description: {props.vacation.description}</span>
            </div>
            <br />
            <span>CheckIn: {props.vacation.checkIn}</span>
            <br />
            <span>CheckOut: {props.vacation.checkOut}</span>
            <br />
            <span>Price: ${props.vacation.price}</span>
            <br />
            <span>Total Followers: {props.vacation.followersCount}</span>
            <br /><br />

            {/* if admin => show buttons edit and delete vacation  */}
            {(props.user.roleId === 'admin') && <>
                <button onClick={() => props.deleteVacation(props.vacation.vacationId)}>❌</button>
                <NavLink to={"/vacation/edit/" + props.vacation?.vacationId}>
                    <button>✏️</button>
                </NavLink>
            </>
            }
        </div>
    );
}

export default VacationCard;
