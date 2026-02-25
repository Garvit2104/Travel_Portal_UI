import {    ReservationTypes, ReservationDocs,  ReservationState,   initialReservationState,    } from '../States/ReservationStates';

export type ReservationAction =
    | { type: "FETCH_REQUEST_TYPE" }
    | { type: "FETCH_REQUEST_TYPE_SUCCESS"; payload: ReservationTypes[] }
    | { type: "FETCH_REQUEST_TYPE_FAILURE"; payload: string }
    | { type: "CREATE_RESERVATION_REQUEST" }
    | { type: "CREATE_RESERVATION_SUCCESS"; payload: string }
    | { type: "CREATE_RESERVATION_FAILURE"; payload: string }
    | { type: "FETCH_RESERVATIONS_REQUEST" }
    | { type: "FETCH_RESERVATIONS_SUCCESS"; payload: ReservationDocs[] }
    | { type: "FETCH_RESERVATIONS_FAILURE"; payload: string }
    | { type: "CLEAR_MESSAGE" };



export const reservationReducer = (state: ReservationState, action: ReservationAction): ReservationState =>{
    switch(action.type){
        case "FETCH_REQUEST_TYPE":
            return { ...state, loading: true, error: null };
        case "FETCH_REQUEST_TYPE_SUCCESS":
            return { 
                ...state, loading: false, reservationTypes: action.payload 
            };
        case "FETCH_REQUEST_TYPE_FAILURE":
            return { ...state, loading: false, error: action.payload };
        case "CREATE_RESERVATION_REQUEST":
            return { ...state, loading: true, error: null, successMessage: null };  
        case "CREATE_RESERVATION_SUCCESS":
            return { ...state, loading: false, successMessage: action.payload };
        case "CREATE_RESERVATION_FAILURE":
            return { ...state, loading: false, error: action.payload };
        case "CLEAR_MESSAGE":
            return { ...state, successMessage: null, error: null };
    }
    return state;
}