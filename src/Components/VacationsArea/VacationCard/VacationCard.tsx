import { NavLink } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import appConfig from "../../../Utils/Config";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
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
            {/* <div className="follow"> */}
                {/* if user => show button follow */}
                {(props.user.roleId === "user") &&
                    <button
                        className={(props.vacation.isFollowing === 1) ? "following" : ""}
                        onClick={onFollowToggle}>{(!props.vacation.isFollowing) ? <AddCircleOutlineRoundedIcon /> : <AddCircleRoundedIcon />}
                    </button>}
            {/* </div> */}
            <br />

            <span>Destination: {props.vacation.destination} <LocationOnIcon /></span>
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
                <button className="delete" onClick={() => props.deleteVacation(props.vacation.vacationId)}><DeleteForeverIcon /></button>
                <NavLink to={"/vacation/edit/" + props.vacation?.vacationId}>
                    <button className="edit"><EditIcon /></button>
                </NavLink>
            </>
            }
        </div>
    );
}

export default VacationCard;
