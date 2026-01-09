import { TravelRequest, TravelRequestInitialState } from "../TP_States/TravelPlannerStates";

export enum TravelPlannerActionType {
    UPDATE_FIELD = "UPDATE_FIELD",
    ADD_TRAVEL_REQUEST = "ADD_TRAVEL_REQUEST",
    REJECT_TRAVEL_REQUEST = "REJECT_TRAVEL_REQUEST",
    APPROVE_TRAVEL_REQUEST=  "APPROVE_TRAVEL_REQUEST",
    RESET_FORM = "RESET_FORM",
}

export type TravelPlannerAction =
    | { type : TravelPlannerActionType.UPDATE_FIELD ; payload : {field: keyof  TravelRequest; value: string |  Date }}
    | { type: TravelPlannerActionType.ADD_TRAVEL_REQUEST; payload: TravelRequest}
    | {type : TravelPlannerActionType.REJECT_TRAVEL_REQUEST; payload: {requestId: number, request_status: string}}
     | {type : TravelPlannerActionType.APPROVE_TRAVEL_REQUEST; payload: {requestId: number; approvedOn: Date, request_status: string}}
    | { type: TravelPlannerActionType.RESET_FORM };

export const TravelPlannerReducer = (state : TravelRequest, action : TravelPlannerAction): TravelRequest => {
    switch(action.type){
        case TravelPlannerActionType.UPDATE_FIELD:
            return {
                ...state,
                 [action.payload.field]: action.payload.value
                };
        
        case  TravelPlannerActionType.ADD_TRAVEL_REQUEST:
            return {
                ...action.payload
            };
        case TravelPlannerActionType.REJECT_TRAVEL_REQUEST:
            return {...state, 
                request_status: state.request_id === action.payload.requestId ? "Rejected" : state.request_status};
         case TravelPlannerActionType.APPROVE_TRAVEL_REQUEST:
             return {
                ...state, 
                request_status: state.request_id === action.payload.requestId ? "Approved" : state.request_status,
                RequestApprovedOn: state.request_id === action.payload.requestId ? action.payload.approvedOn : state.RequestApprovedOn
            };
        case TravelPlannerActionType.RESET_FORM:
            return TravelRequestInitialState;
        default:
            return state;
    }
}

