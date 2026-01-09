import { createContext, useReducer } from "react";
import { Employee, EmployeeIniitalState } from "../HR_States/EmployeeStates";
import { EmployeeActionType, EmployeeAction, EmployeeReducer  } from "../HR_Actions/EmployeeReducer";

type EmployeeContextType = {
    state : Employee;
    dispatch : React.Dispatch<EmployeeAction>;
}

type EmployeeContextProviderProps = {
    children : React.ReactNode;
}
const EmployeeContext = createContext<EmployeeContextType>({
    state : EmployeeIniitalState,
    dispatch : () => {},
});

const EmployeeProvider = ({children} : EmployeeContextProviderProps) => {
    const [state, dispatch] = useReducer(EmployeeReducer, EmployeeIniitalState);
    return(
        <EmployeeContext.Provider value={{state, dispatch}}>
            {children}
        </ EmployeeContext.Provider>
    );
}

export {EmployeeContext, EmployeeProvider};
    
