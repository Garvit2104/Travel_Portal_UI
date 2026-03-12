import React, { createContext, useReducer, useContext } from "react";
import { ReimbursementState, initialReimbursementState } from "../States/ReimbursementStates";
import { ReimbursementAction, ReimbursementReducer } from "../Actions/ReimbursementReducer";

type ReimbursementContextType = {
    state: ReimbursementState;
    dispatch: React.Dispatch<ReimbursementAction>;
}

type ReimbursementProviderProps = {
    children: React.ReactNode;
}
// step 1: create context
const ReimbursementContext = createContext<ReimbursementContextType>({
    state: initialReimbursementState,
    dispatch: () => { }
});
// step 2: create provider component
const ReimbursementProvider = ({ children }: ReimbursementProviderProps) => {
    const [state, dispatch] = useReducer(ReimbursementReducer, initialReimbursementState);
    return (
        <ReimbursementContext.Provider value={{ state, dispatch }}>
            {children}
        </ReimbursementContext.Provider>
    );
}

export { ReimbursementContext, ReimbursementProvider };