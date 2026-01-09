import React, { createContext, useMemo } from 'react';
import { TravelRequest, TravelRequestInitialState } from '../TP_States/TravelPlannerStates';
import { TravelPlannerAction, TravelPlannerActionType } from '../Actions/TravelPlannerReducer';
import { TravelPlannerReducer } from '../Actions/TravelPlannerReducer';

type TravelPlannerContextType = {
    state : TravelRequest;
    dispatch : React.Dispatch<TravelPlannerAction>;
}

type TravelPlannerContextProviderProps = {
    children : React.ReactNode;
}
const TravelPlannerContext = createContext<TravelPlannerContextType>({
    state : TravelRequestInitialState,
    dispatch : () => {},
});

const TravelPlannerProvider = ({children} : TravelPlannerContextProviderProps) => {
    const [state, dispatch] = React.useReducer(TravelPlannerReducer, TravelRequestInitialState);
    
    return(
        <TravelPlannerContext.Provider value={{state, dispatch}}>
            {children}
        </ TravelPlannerContext.Provider>
    );
}

export {TravelPlannerContext, TravelPlannerProvider};