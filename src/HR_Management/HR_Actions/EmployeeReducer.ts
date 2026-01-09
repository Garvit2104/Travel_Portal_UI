import { Employee } from "../HR_States/EmployeeStates";
import { EmployeeIniitalState } from "../HR_States/EmployeeStates";

export enum EmployeeActionType  { 
    ADD_EMPLOYEE = "ADD_EMPLOYEE",
    REMOVE_EMPLOYEE = "REMOVE_EMPLOYEE",
    UPDATE_EMPLOYEE=  "UPDATE_EMPLOYEE",
    UPDATE_FIELD = "UPDATE_FIELD",
    RESET_FORM = "RESET_FORM"
};


export type EmployeeAction = 
| { type: EmployeeActionType.ADD_EMPLOYEE ; payload: Employee }
| { type: 'REMOVE_EMPLOYEE'; payload: number }
| { type: EmployeeActionType.UPDATE_EMPLOYEE ; payload: Employee }
| { type: EmployeeActionType.UPDATE_FIELD ; payload : {field: keyof Employee; value: string | number}}
| { type: EmployeeActionType.RESET_FORM };


export const EmployeeReducer = (state : Employee, action : EmployeeAction) : Employee =>{
    switch(action.type){
        case EmployeeActionType.UPDATE_FIELD:
            return {...state, [action.payload.field]: action.payload.value };
        case EmployeeActionType.RESET_FORM:
            return EmployeeIniitalState;
        case EmployeeActionType.ADD_EMPLOYEE:
            return {...state, ...action.payload};
        case EmployeeActionType.REMOVE_EMPLOYEE:
            return {...state, employee_id: state.employee_id === action.payload ? 0 : state.employee_id};       
        default:
            return state;
    }
}