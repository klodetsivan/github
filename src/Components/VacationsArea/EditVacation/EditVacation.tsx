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
        <div className="EditVacation">
            <form onSubmit={handleSubmit(send)}>
                <h2>Update Vacation</h2>

                <input type="hidden" {...register("vacationId")} />

                
                <input type="text" placeholder="Description"{...register("description", VacationModel.descriptionValidation)} />
                <span className="error">{formState.errors.description?.message}</span>

               
                <input type="text" placeholder="Destination"{...register("destination", VacationModel.destinationValidation)} />
                <span className="error">{formState.errors.destination?.message}</span>

               
                <input type="date" placeholder="CheckIn"{...register("checkIn", VacationModel.checkInValidation)} />
                <span className="error">{formState.errors.checkIn?.message}</span>

                
                <input type="date" placeholder="CheckOut"{...register("checkOut", VacationModel.checkOutValidation)} />
                <span className="error">{formState.errors.checkOut?.message}</span>

               
                <input type="number" placeholder="Price"{...register("price", VacationModel.priceValidation)} />
                <span className="error">{formState.errors.price?.message}</span>

                
                <input type="file" accept="image/*" placeholder="Image"{...register("image")} />

                <input type="hidden" {...register("imageName")} />

                <button>Update</button>
            </form>
        </div>
    );
}

export default EditVacation;