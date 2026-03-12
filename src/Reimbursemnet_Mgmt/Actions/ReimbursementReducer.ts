import { ReimbursementTypes, ReimbursementState, ReimbursementRequests } from "../States/ReimbursementStates";


export type ReimbursementAction =
    | { type: "FETCH_REIMBURSEMENT_TYPES_REQUEST" }
    | { type: "SUCCESS_FETCH_REIMBURSEMENT_TYPES"; payload: ReimbursementTypes[] }
    | { type: "FAILURE_FETCH_REIMBURSEMENT_TYPES"; payload: string }

    | { type: "CREATE_REIMBURSEMENT_REQUEST" }
    | { type: "SUCCESS_CREATE_REIMBURSEMENT"; payload: string }
    | { type: "FAILURE_CREATE_REIMBURSEMENT"; payload: string }


export const ReimbursementReducer = (state: ReimbursementState, action: ReimbursementAction): ReimbursementState => {
    switch (action.type) {
        case "FETCH_REIMBURSEMENT_TYPES_REQUEST":
            return {
                ...state,
                error: null,
            };     
        case "SUCCESS_FETCH_REIMBURSEMENT_TYPES":
            return {
                ...state,
                reimbursementTypes: action.payload,
            };  

        case "FAILURE_FETCH_REIMBURSEMENT_TYPES":
            return {
                ...state,
                error: action.payload,
            };
        case "CREATE_REIMBURSEMENT_REQUEST":
            return {
                ...state,
                error: null,
                successMessage: null,
            };
        case "SUCCESS_CREATE_REIMBURSEMENT":
            return {
                ...state,
                successMessage: action.payload,
            };

        case "FAILURE_CREATE_REIMBURSEMENT":
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;                           
    }
}