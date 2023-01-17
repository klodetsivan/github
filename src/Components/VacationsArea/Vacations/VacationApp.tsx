import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vacationsStore } from "../../../Redux/VacationsState";
import { authStore } from "../../../Redux/AuthState";
import VacationModel from "../../../Models/VacationModel";
import VacationsList from "../VacationsList/VacationsList";
import vacationsService from "../../../Services/VacationsService";
import notifyService from "../../../Services/NotifyService";
import UserModel from "../../../Models/UserModel";
import "./Vacations.css";


function VacationApp(): JSX.Element {

    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [pageIdx, setPageIdx] = useState<number>(0)
    const [isMyVacations, setIsMyVacations] = useState<boolean>(false);
    const [user, setUser] = useState<UserModel>();

    const navigate = useNavigate();

    // PAGINATION
    const pageSize = 10


    useEffect(() => {
        const user = authStore.getState().user
        if (!user) {
            setTimeout(() => {
                navigate('/auth/register')
            }, 3000)

            return
        }
        setUser(user)

        loadVacations()

        const unsubscribe = authStore.subscribe(() => {

            setUser(authStore.getState().user)
        })

        return () => {
            //to unsubscribe:
            unsubscribe();
        }

    }, []);


    useEffect(() => {

        const unsubscribe = vacationsStore.subscribe(() => {

            setVacations(vacationsStore.getState().vacations)
        })

        return () => {
            //to unsubscribe:
            unsubscribe();
        }

    }, []);

    async function loadVacations(): Promise<void> {
        await vacationsService.getAllVacations()
            .then(vacations => setVacations(vacations))
            .catch(err => notifyService.error(err))
    }

    async function followToggle(vacationId: number): Promise<void> {
        console.log(vacationId, 'from follow toggle');

        try {
            // update follow for vacation
            await vacationsService.followToggle(vacationId);
        }
        catch (err: any) {
            alert(err)
        }
    }

    async function unFollowToggle(vacationId: number): Promise<void> {
        console.log('unFollow from frontend');

        try {
            // update unFollow for vacation by id
            await vacationsService.unFollowToggle(vacationId);
        }
        catch (err: any) {
            alert(err)
        }
    }

    async function deleteVacation(vacationId: number) {
        try {
            //delete in backend
            await vacationsService.deleteVacation(vacationId);
            // duplicate vacations => delete a specific vacations => set new updated vacations array state 
            const duplicatedVacations = [...vacations]
            const index = duplicatedVacations.findIndex(v => v.vacationId === vacationId);
            duplicatedVacations.splice(index, 1);
            setVacations(duplicatedVacations);
            notifyService.success("vacation has been deleted");
            navigate("/vacations");
        }
        catch (err: any) {
            notifyService.error(err);
        }
    }

    function getVacationsForDisplay() {
        //if have vacations on follow then filter only followed vacations else bring all vacations
        let vacationsForPag = (isMyVacations) ?
            vacations.filter(v => v.isFollowing) :
            vacations

        vacationsForPag = vacationsForPag.sort(function (a, b) {
            return new Date(a.checkIn).valueOf() - new Date(b.checkIn).valueOf()
        })

        vacationsForPag = vacationsForPag.map(v => ({ ...v, checkIn: getFormatedDate(v.checkIn), checkOut: getFormatedDate(v.checkOut) }))
        //send to pagination function the vacations to display
        return paginationVac(vacationsForPag)
    }

    function getFormatedDate(date: string) {
        var p = date.split(/\D/g)
        return [p[2], p[1], p[0]].join("/")

    }

    function onChangePageIdx(diff: number) {
        const nextPageIdx = pageIdx + diff
        // console.log('nextPageIdx', nextPageIdx);
        if (nextPageIdx < 0 || nextPageIdx * pageSize >= vacations.length) {
            // console.log('Not in Range!');
            return
        }
        setPageIdx(nextPageIdx)

    }

    function paginationVac(vacations: VacationModel[]) {
        let startIdx = pageIdx * pageSize
        return vacations.slice(startIdx, pageSize + startIdx)

    }

    console.log('pooooo', vacations);

    if (!user) return <h1>Please register first!!!</h1>
    return (
        <div className="Vacations">
            {/* if user => show button "my vacation" follow filter  */}
            {(user?.roleId === 'user') &&

                <button className="followedVacations" onClick={() => setIsMyVacations(!isMyVacations)} >
                    {user && (!isMyVacations) ? 'My Vacations' : 'All Vacations'}</button>

            }

            <VacationsList
                vacations={getVacationsForDisplay()}
                deleteVacation={deleteVacation}
                followToggle={followToggle}
                unFollowToggle={unFollowToggle}
                user={user}
            />
            <div className="pagination">
                <button onClick={() => onChangePageIdx(1)}>➕</button>
                <span>-{pageIdx + 1}-</span>
                <button onClick={() => onChangePageIdx(-1)}>➖</button>
                <br />

            </div>
        </div>



    );
}

export default VacationApp;
