import React, { useState, useContext, useEffect } from 'react';
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { TravelPlannerContext } from '../Context/TravelPlannerContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs"; 
import { TravelPlannerActionType } from '../Actions/TravelPlannerReducer';
import { TravelRequest } from '../TP_States/TravelPlannerStates';
import CustomModal from '../../Common/Modals';
import modalMessages from '../Resources/TRequest.json';
import { useNavigate } from 'react-router-dom';

type Location = {
    id: number;
    name: string;
}

const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function NewTravelRequest() {
    const {state, dispatch} = useContext(TravelPlannerContext);
    const navigate = useNavigate();

    const [locations, setLocations] = useState<Location[]>([]);

    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [warningOpen, setWarningOpen] = useState(false);

    const [errors, setErrors] = useState<{[key : string]: string}>({});
  
    const [generatedRequestId, setGeneratedRequestId] = useState<number | null>(null);

    const toIntOrNull = (s : string): number | null =>{
        if(!s) return null;

        const numField = Number(s);
        return Number.isNaN(numField) ? null : numField;
    };

    const toIsoOrNullFromDayjs = (date : Dayjs | null) =>(date ? date.format("YYYY-MM-DD") : null);
    
    const buildRequestDTO = (form : TravelRequest) =>({
        raised_by_employee_id: toIntOrNull(form.raised_by_employee_id),
        to_be_approved_by_hr_id: toIntOrNull(form.to_be_approved_by_hr_id),
        location_id: toIntOrNull(form.location_id || ""),
        purpose_of_travel: form.purpose_of_travel?.trim(),
        request_status: "New",
        Priority: form.Priority?.trim(),

        from_date: toIsoOrNullFromDayjs(form.from_date),
        to_date: toIsoOrNullFromDayjs(form.to_date),
        RequestApprovedOn: null,

    })
    
    const travelRequestValidation = ():boolean =>{
        const newErrors: {[key : string]: string} = {};
        if(!String(state.raised_by_employee_id).trim()){
            newErrors.raised_by_employee_id = "Employee ID is required";
        }
        if(!String(state.to_be_approved_by_hr_id).trim()){
            newErrors.to_be_approved_by_hr_id = "HR ID is required";
        }
        if(!String(state.location_id).trim()){
            newErrors.location_id = "Location is required";
        }
        if(!String(state.purpose_of_travel).trim()){
            newErrors.purpose_of_travel = "Purpose of Travel is required";
        }
        
        if(!String(state.Priority).trim()){
            newErrors.Priority = "Priority is required";
        }     
        
        if (!state.from_date) {
            newErrors.from_date = "From date is required";
    }
        if (!state.to_date) {
            newErrors.to_date = "To date is required";
        }
        if (state.from_date && state.to_date && 
            !dayjs(state.to_date).isAfter(dayjs(state.from_date))) {
            newErrors.to_date = "To date must be after From date";
        }
        setErrors(newErrors);
            return Object.keys(newErrors).length === 0;       
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = event.target;
        
        dispatch({
                type: TravelPlannerActionType.UPDATE_FIELD, 
                payload: {field: name as keyof TravelRequest, value}}
        );
    }

    const handleLocationChange = (e: SelectChangeEvent<string>) =>{
        dispatch({
            type: TravelPlannerActionType.UPDATE_FIELD,
            payload: {field: "location_id", value: e.target.value}
        })
    }

    const handlePriorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: TravelPlannerActionType.UPDATE_FIELD,
      payload: { field: "Priority", value: e.target.value }
    });
  };

    const handleDateChange = (field : keyof TravelRequest, value: Dayjs | null) =>{
        dispatch({  
            type: TravelPlannerActionType.UPDATE_FIELD, 
            payload: {field, value: value as any}
        });
    }

    useEffect(()=>{
        const getLocations = async () =>{
            try{
                const response = await fetch("http://localhost:5000/api/TP_Services/locations");
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setLocations(data);
            }catch{
                console.error("Error fetching locations");
            }
        };
        getLocations();
    },[])

    const handleCreateRequest = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isValid = travelRequestValidation();
        if(!isValid){
            setWarningOpen(true);
            return;
        }

        try{
            const response = await fetch("http://localhost:5000/api/TP_Services/travelrequests/new",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(buildRequestDTO(state))
            });
            if(!response.ok){
                const text = await response.text().catch(() => "");
                console.error("Create travel request failed:", `${response.status} ${response.statusText} - ${text}`);
                setErrorOpen(true);
                return;
            } 
            const result = await response.json().catch(() => null);
            if (result?.travel_request_id) {
                setGeneratedRequestId(result.travel_request_id);
            }        
            setSuccessOpen(true);
            dispatch({ type: TravelPlannerActionType.RESET_FORM });

        } catch (error) {
            console.log("Travel request failed to create", error);
            setErrorOpen(true);
        } 
    }
    
  return (
    <>
    <Box sx={{
        
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 5,
        pt: 4,
      }}>
    <Container maxWidth ="sm">
        <Paper elevation={3} style={{padding: '20px', marginTop: '20px'}}>
            <Typography component = "h1" variant="h5" align="center">
                New Travel Request 
            </Typography>
            
            <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleCreateRequest}>
                <Box sx = {{display: 'flex', gap: 2, mb: 2}}>
                    <TextField
                        type='number'
                        name="raised_by_employee_id"
                        label="Employee ID"
                        placeholder="Enter Employee ID"
                        value={state.raised_by_employee_id}
                        onChange={handleChange}
                        fullWidth
                        required    
                    />

                    <TextField
                        type='number'
                        name="to_be_approved_by_hr_id"
                        label="HR ID"
                        placeholder="Enter HR ID"
                        value={state.to_be_approved_by_hr_id}
                        onChange={handleChange}
                        fullWidth
                        required    
                    />
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx = {{display: 'flex', gap: 2, mb: 2}}>
                    <DatePicker
                        label="From Date"
                        value={state.from_date}
                        onChange={(newValue) => handleDateChange("from_date", newValue)}
                        disablePast
                        slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                            },
                          }} 
                    />
                    <DatePicker
                        label="To Date"
                        value={state.to_date}
                        onChange={(newValue) => handleDateChange("to_date", newValue)}
                        disablePast
                        slotProps={{
                            textField: {
                              fullWidth: true,
                              required: true,
                            },
                          }}
                    />

                </Box>
                </LocalizationProvider>
                <Box sx = {{display: 'flex', gap: 2, mb: 2}}>
                    <TextField
                        name="purpose_of_travel"
                        label="Purpose of Travel"
                        placeholder="Enter Purpose of Travel"
                        value={state.purpose_of_travel}
                        onChange={handleChange}
                        fullWidth
                        required    
                    />
                    <FormControl fullWidth required>
                        <InputLabel id="location-label">Location</InputLabel>
                        <Select 
                        labelId="location-label" 
                        name="location_id" 
                        value={state.location_id || ""} 
                        onChange={handleLocationChange}
                            // dispatch({ type: TravelPlannerActionType.UPDATE_FIELD, payload: { field: "location_id", value: e.target.value } })
                        //   }
                        label="Location"
                        >
                    <MenuItem value="" disabled>
                    Select Location
                  </MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc.id} value={String(loc.id)}>
                      {loc.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.location_id && (
                    <Typography variant="caption" color="error">
                      {errors.location_id}
                    </Typography>
                  )}
              </FormControl>
                </Box>
                  <Box>
                    <TextField
                        name="Priority"
                        label="Priority"
                        placeholder="Enter Priority"
                        value={state.Priority}
                        onChange={handleChange}
                        fullWidth
                        required    
                    />
                </Box>
                <Grid container spacing={4}
                sx ={{
                    justifyContent: 'center',
                    alignItems: 'center',}}
                >
                <Grid size ={{xs:12, sm:8, md: 6, }}>
                <Button fullWidth variant="contained" 
                    color="primary" type="submit"      
                 >
                    CREATE
                </Button>
                </Grid>
                </Grid> 
            </Box>         
        </Paper>
    </Container>
    </Box>
          <CustomModal
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          title={modalMessages.CreateRequest.success.title}
          message={generatedRequestId
            ? `${modalMessages.CreateRequest.success.message} Request ID: ${generatedRequestId}`
            :modalMessages.CreateRequest.success.message}
          color={modalMessages.CreateRequest.success.color}
        />
        <CustomModal
          open={errorOpen}
          onClose={() => setErrorOpen(false)}
          title={modalMessages.CreateRequest.error.title}
          message={modalMessages.CreateRequest.error.message}
          color={modalMessages.CreateRequest.error.color}
        />
        <CustomModal
          open={warningOpen}
          onClose={() => setWarningOpen(false)}
          title={modalMessages.CreateRequest.warning.title}
          message={modalMessages.CreateRequest.warning.message}
          color={modalMessages.CreateRequest.warning.color}
        />
    
    </>
  )
}





