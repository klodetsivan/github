import VacationModel from "../../../Models/VacationModel";
import VacationCard from "../VacationCard/VacationCard";
import UserModel from "../../../Models/UserModel";
import "./VacationsList.css";


interface VacationListProps {
    vacations: Array<VacationModel>;
    user: UserModel
    deleteVacation: (vacationId: number) => void;
    followToggle: (vacationId: number) => void;
    unFollowToggle: (vacationId: number) => void;
}

function VacationsList(props: VacationListProps): JSX.Element {
    
    return (
        <div className="VacationsList">
            {
                <div className="container">
                    {props.vacations.map((v: any) => <VacationCard

                        key={v.vacationId}
                        vacation={v}
                        deleteVacation={props.deleteVacation}
                        followToggle={props.followToggle}
                        user={props.user}
                        unFollowToggle={props.unFollowToggle}

                    />)}

                </div>}
            <div>
                {/* <Pagination className="pagination" count={10} variant="outlined" shape="rounded" /> */}
            </div>


        </div>
    );
}

export default VacationsList;
