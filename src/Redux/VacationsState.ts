// global state for all vacations

import { createStore } from "redux";
import VacationModel from "../Models/VacationModel";

// 1.global state - the global data
export class VacationsState {
    public vacations: VacationModel[] = [];
}

// 2.action type- a list of operations we can perform on the data:
export enum VacationsActionType {
    fetchVacations = "fetchVacations",
    addVacations = "addVacations",
    updateVacations = "updateVacations",
    deleteVacations = "deleteVacations"
}

// 3.action = a single object which dispatch sends to redux for some change:
export interface VacationsAction {
    type: VacationsActionType;
    payload: any;
}

//4.reducer - a function which will be invoked when calling dispatch to perform the operation
export function vacationsReducer(currentState = new VacationsState(), action: VacationsAction): VacationsState {

    const newState = { ...currentState }

    switch (action.type) {
        case VacationsActionType.fetchVacations: //here the payload is a list of vacations: vacationModel[]
            newState.vacations = action.payload;
            break;

        case VacationsActionType.addVacations:  //here the payload is a vacation to add: vacationModel
            newState.vacations.push(action.payload);
            
            break;

        case VacationsActionType.updateVacations:  //here the payload is vacation to update:vacationModel
            const indexToUpdate = newState.vacations.findIndex(v => v.vacationId === action.payload.vacationId);
            if (indexToUpdate >= 0) {
                newState.vacations[indexToUpdate] = action.payload
            }
            break;

        case VacationsActionType.deleteVacations:  //here the payload is the id of the vacation to delete: number
           console.log('hi', action.payload, )
        const indexToDelete = newState.vacations.findIndex(v => v.vacationId === action.payload);
            if (indexToDelete >= 0) {
                newState.vacations.splice(indexToDelete, 1)
            } else { 
                console.log('im in else')
            }
            break;
    }
    
    return newState;
}

// 5.store - manager object from redux library which handle the entire operations
export const vacationsStore = createStore(vacationsReducer);