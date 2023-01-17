import axios from "axios";
import VacationModel from "../Models/VacationModel";
import { VacationsActionType, vacationsStore } from "../Redux/VacationsState";
import appConfig from "../Utils/Config";
import {  authStore } from "../Redux/AuthState";


class VacationsService {

    // get all vacations for specific user
    public async getAllVacations(): Promise<VacationModel[]> {

        // take vacations from local store 
        let vacations = vacationsStore.getState().vacations;
        console.log('vacations lengtg:', vacations.length);
        
        // take user from local store 
        let userId = authStore.getState().user.id;

        // if first time and no vacations yet 
        if (vacations.length === 0) {
            console.log('AJAX!!!!!@!');
            
            // ajax request 
            const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl + userId);

            // extract vacations 
            vacations = response.data;

            // save vacations to global state:
            vacationsStore.dispatch({ type: VacationsActionType.fetchVacations, payload: vacations })
        }

        // return vacations 
        return vacations;
    }

    // get one vacation 
    public async getOneVacation(vacationId: number): Promise<VacationModel> {

        // take vacations from local store 
        let vacations = vacationsStore.getState().vacations;

        // find needed vacation 
        let vacation = vacations.find((v: { vacationId: number; }) => v.vacationId === vacationId);

        // if we don't have the vacation in the global state 
        if (!vacation) {
            // ajax request 
            const response = await axios.get<VacationModel>(appConfig.vacationsUrl + vacationId);

            // extract vacation
            vacation = response.data;

        }

        // return vacation 
        return vacation;
    }

    //add vacation
    public async addVacation(vacation: VacationModel): Promise<void> {

        // new vac followers count declared = 0 
        vacation.followersCount = 0;

        // sending object with files (images) using formData:

        const myFormData = new FormData(); //can contain string and or files
        myFormData.append("description", vacation.description);
        myFormData.append("destination", vacation.destination);
        myFormData.append("checkIn", vacation.checkIn.toString());
        myFormData.append("checkOut", vacation.checkOut.toString());
        myFormData.append("price", vacation.price.toString());
        myFormData.append("followersCount", vacation.followersCount.toString());
        myFormData.append("image", vacation.image[0]); // image = fileList , image[0] = file

        // send to backend the new added vacation 
        const response = await axios.post<VacationModel>(appConfig.vacationsUrl, myFormData);

        // extract the added vacation 
        const addedVacation = response.data;

        //add the added vacation to global state:
        vacationsStore.dispatch({ type: VacationsActionType.addVacations, payload: addedVacation })

    }

    //update vacation
    public async updateVacation(vacation: VacationModel): Promise<void> {
        

        const myFormData = new FormData(); //can contain string and or files
        myFormData.append("description", vacation.description);
        myFormData.append("destination", vacation.destination);
        myFormData.append("checkIn", vacation.checkIn.toString());
        myFormData.append("checkOut", vacation.checkOut.toString());
        myFormData.append("price", vacation.price.toString());
        myFormData.append("followersCount", vacation.followersCount.toString());
        myFormData.append("image", vacation.image[0]); // image = fileList , image[0] = file
        myFormData.append("imageName", vacation.imageName); // keep old image if no update

        // send to backend the updated vacation 
        const response = await axios.put<VacationModel>(appConfig.vacationsUrl + vacation.vacationId, myFormData);

        // extract the updated vacation 
        const updatedVacation = response.data;
      
        //update the vacation in the global store:
        vacationsStore.dispatch({ type: VacationsActionType.updateVacations, payload: updatedVacation })

    }

    //delete vacation
    public async deleteVacation(vacationId: number): Promise<void> {

        // delete in back end 
        await axios.delete<void>(appConfig.vacationsUrl + vacationId);
        console.log(vacationId);
        
        // delete in global state 
        vacationsStore.dispatch({ type: VacationsActionType.deleteVacations, payload: vacationId })
    }

    public async followToggle(vacationId: number): Promise<void> {
        //get userId from redux
        let userId = authStore.getState().user.id;
        // send post request to follow a specific vacation for specific user 
        const response = await axios.post<void>(`${appConfig.followUrl}${vacationId}/${userId}`);
        // receive back the new vacations with follow state 
        const updatedVacations = response.data
        // send new info back to redux(global state) 
        vacationsStore.dispatch({ type: VacationsActionType.fetchVacations, payload: updatedVacations })
    }

    public async unFollowToggle(vacationId: number): Promise<void> {
        //get userId from redux
        let userId = authStore.getState().user.id;
        // send post request to unFollow a specific vacation for specific user 
        const response = await axios.delete<void>(`${appConfig.followUrl}${vacationId}/${userId}`);
        // receive back the new vacations with follow state 
        const updatedVacations = response.data
        // send new info back to redux(global state) 
        vacationsStore.dispatch({ type: VacationsActionType.fetchVacations, payload: updatedVacations })
    }

}

const vacationsService = new VacationsService();

export default vacationsService;