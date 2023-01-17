import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authStore } from "../../../Redux/AuthState";
import UserModel from "../../../Models/UserModel";
import VacationModel from "../../../Models/VacationModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import "./AddVacation.css";

function AddVacation(): JSX.Element {


    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const [user, setUser] = useState<UserModel>();
    const navigate = useNavigate();
   
    useEffect(() => {
        const user = authStore.getState().user
        if(user?.roleId !== 'admin'){
            setTimeout(()=>{
                navigate('/vacations')
            },2000)

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


    async function send(vacation: VacationModel) {
        try {
            await vacationsService.addVacation(vacation);
            notifyService.success("vacation has been successfully added");
            navigate("/vacations")
        }
        catch (err: any) {
            notifyService.error(err);
        }

    }

    if(user?.roleId !== 'admin') return <h1>not allowed</h1>
    return ( 
        
        <div className="AddVacation">
			
            <form onSubmit={handleSubmit(send)}>

                <h2>Add Vacation</h2>

        
                <input type="text" placeholder="Description" {...register("description", VacationModel.descriptionValidation)} />
                <span className="Error">{formState.errors.description?.message}</span>

                
                <input type="text" placeholder="Destination" {...register("destination", VacationModel.destinationValidation)} />
                <span className="Error">{formState.errors.destination?.message}</span>

                <input type="date" placeholder="Check-In" {...register("checkIn", VacationModel.checkInValidation)} />
                <span className="Error">{formState.errors.checkIn?.message}</span>

                
                <input type="date" placeholder="Check-Out"{...register("checkOut", VacationModel.checkOutValidation)} />
                <span className="Error">{formState.errors.checkOut?.message}</span>

                
                <input type="number" placeholder="Price"{...register("price", VacationModel.priceValidation)} />
                <span className="Error">{formState.errors.price?.message}</span>
                
                
                <input type="file" accept="image/*" placeholder="Image"{...register("image")} />
                <span className="Error">{formState.errors.image?.message}</span>
                
                <button>Add</button>

            </form>

        </div>
    );
}

export default AddVacation;
