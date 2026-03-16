import { createContext, useReducer } from "react";
import { initialReservationState, ReservationState } from "../States/ReservationStates";
import { ReservationAction, reservationReducer} from "../Actions/ReservationReducer";

type ReservationContextType = {
    state : ReservationState;
    dispatch : React.Dispatch<ReservationAction>;
}

type ReservationContextProviderProps = {
    children : React.ReactNode;
}

const ReservationContext = createContext<ReservationContextType>({
    state : initialReservationState, 
    dispatch : () => {}
});

const ReservationProvider = ({children} : ReservationContextProviderProps) => {
    const [state, dispatch] = useReducer(reservationReducer, initialReservationState);
    return(
        <ReservationContext.Provider value={{state, dispatch}}>
            {children}
        </ ReservationContext.Provider>
    );
}
export { ReservationContext, ReservationProvider };
