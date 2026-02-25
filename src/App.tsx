import React, {useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { EmployeeProvider } from '../src/HR_Management/Context/EmployeeContext';
import AddEmployee from '../src/HR_Management/Components/AddEmployee';
import EmployeeList from '../src/HR_Management/Components/EmployeeList';
import Home from '../src/Common/HomePage';
import NewTravelRequest from '../src/TravelPlanner_Mgmt/Components/NewTravelRequest'
import { TravelPlannerContext, TravelPlannerProvider } from './TravelPlanner_Mgmt/Context/TravelPlannerContext';
import { TravelPlannerAction } from './TravelPlanner_Mgmt/Actions/TravelPlannerReducer';
import RequestBudgetDetails from './TravelPlanner_Mgmt/Components/RequestBudgetDetails';
import PendingRequestList from './TravelPlanner_Mgmt/Components/PendingRequestLists';
import Layout from './Layout/Layout';
import {ReservationContext, ReservationProvider} from './Reservations/Context/ReservationContext';

function App() {
  const[open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(prev => !prev);
  };

  return (
    <div className="App">
    <EmployeeProvider>
      <TravelPlannerProvider>
        <ReservationProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/employee-detail" element={<EmployeeList />} />
          <Route path="/add-user/:employeeId" element={<AddEmployee/>} />
          <Route path= "/new-travel-request" element= {<NewTravelRequest/>} />
          <Route path= "/pending-travel-request" element= {<PendingRequestList/>} />
          <Route path='/travelplannerdetail/:id' element= {<RequestBudgetDetails/>} />
          </Route>
        </Routes>
      </Router>
      </ReservationProvider>
      </TravelPlannerProvider>
    </EmployeeProvider>
</div>

);
}

export default App;
