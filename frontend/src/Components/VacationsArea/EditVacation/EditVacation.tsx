import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { authStore } from "../../../Redux/AuthState";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import "./EditVacation.css";

function EditVacation(): JSX.Element {

    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const navigate = useNavigate()
    const params = useParams();
    const [user, setUser] = useState<UserModel>();


    useEffect(() => {
        // get user from redux 
        const user = authStore.getState().user
        // check if the user is admin or regular user 
        if (user?.roleId !== 'admin') {
            // if not admin - navigate back to vacations after 2 sec
            setTimeout(() => {
                navigate('/vacations')
            }, 2000)

            return
        }
        // update user state
        setUser(user)
        // listen to changes in user state 
        const unsubscribe = authStore.subscribe(() => {
            // update user if any change occurred 
            setUser(authStore.getState().user)
        })

        return () => {
            //to unsubscribe:
            unsubscribe();
        }

    }, []);

    useEffect(() => {
        const id = +params?.vacId
        vacationsService.getOneVacation(id)
            .then(vacation => {
            
                setValue("vacationId", vacation.vacationId);
                setValue("description", vacation.description);
                setValue("destination", vacation.destination);
                setValue("checkIn", vacation.checkIn);
                setValue("checkOut", vacation.checkOut);
                setValue("price", vacation.price);
                setValue("followersCount", vacation.followersCount);
                setValue("image", vacation.image);
                setValue("imageName", vacation.imageName);
               
            })
            .catch(err => notifyService.error(err));
    }, []);

    async function send(vacation: VacationModel) {
        try {
            await vacationsService.updateVacation(vacation);
            notifyService.success("vacation updated successfully");
            navigate("/vacations")
        } catch (err: any) {
            notifyService.error(err);
        }
    }


    if (user?.roleId !== 'admin') return <h1>not allowed</h1>
    return (
        <div className="EditProduct Box">
            <form onSubmit={handleSubmit(send)}>
                <h2>Update Vacation</h2>

                <input type="hidden" {...register("vacationId")} />

                <label>Description:</label>
                <input type="text" {...register("description", VacationModel.descriptionValidation)} />
                <span className="error">{formState.errors.description?.message}</span>

                <label>Destination:</label>
                <input type="text" {...register("destination", VacationModel.destinationValidation)} />
                <span className="error">{formState.errors.destination?.message}</span>

                <label>CheckIn:</label>
                <input type="date"{...register("checkIn", VacationModel.checkInValidation)} />
                <span className="error">{formState.errors.checkIn?.message}</span>

                <label>CheckOut:</label>
                <input type="date"{...register("checkOut", VacationModel.checkOutValidation)} />
                <span className="error">{formState.errors.checkOut?.message}</span>

                <label>Price:</label>
                <input type="number"{...register("price", VacationModel.priceValidation)} />
                <span className="error">{formState.errors.price?.message}</span>

                <label>Image:</label>
                <input type="file" accept="image/*" {...register("image")} />

                <input type="hidden" {...register("imageName")} />

                <button>Update</button>
            </form>
        </div>
    );
}

export default EditVacation;