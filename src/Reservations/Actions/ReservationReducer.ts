import {    ReservationTypes, ReservationDocs,  ReservationState,   initialReservationState, Reservation,    } from '../States/ReservationStates';

export type ReservationAction =
  | { type: "FETCH_REQUEST_TYPE" }
  | { type: "FETCH_REQUEST_TYPE_SUCCESS"; payload: ReservationTypes[] }
  | { type: "FETCH_REQUEST_TYPE_FAILURE"; payload: string }

  | { type: "CREATE_RESERVATION_REQUEST" }
  | { type: "CREATE_RESERVATION_SUCCESS"; payload: string }
  | { type: "CREATE_RESERVATION_FAILURE"; payload: string }

  | { type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID" }
  | { type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_SUCCESS"; payload: Reservation[] }
  | { type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_FAILURE"; payload: string }

  | { type: "CLEAR_MESSAGE" };



export const reservationReducer = (state: ReservationState,action: ReservationAction): ReservationState => {
  switch (action.type) {
    case "FETCH_REQUEST_TYPE":
      return { ...state,  error: null };

    case "FETCH_REQUEST_TYPE_SUCCESS":
      return {
        ...state,
        reservationTypes: action.payload
      };

    case "FETCH_REQUEST_TYPE_FAILURE":
      return {
        ...state,
        error: action.payload
      };

  
    case "CREATE_RESERVATION_REQUEST":
      return {
        ...state,
        error: null,
        successMessage: null
      };

    case "CREATE_RESERVATION_SUCCESS":
      return {
        ...state,
        successMessage: action.payload
      };

    case "CREATE_RESERVATION_FAILURE":
      return {
        ...state,
        error: action.payload
      };

    case "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID":
      return {
        ...state,
        loading: true,
        error: null,
        reservations: []
      };

    case "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_SUCCESS":
      return {
        ...state,
        loading: false,
        reservations: action.payload
      };

    case "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case "CLEAR_MESSAGE":
      return {
        ...state,
        successMessage: null,
        error: null
      };

    default:
      return state;
  }
};