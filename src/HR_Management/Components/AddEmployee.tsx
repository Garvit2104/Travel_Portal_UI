import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Container,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { EmployeeContext } from "../Context/EmployeeContext";
import CustomModal from "../../Common/Modals";
import modalMessages from "../Resources/HR_Resource.json";
import { useLocation, useParams } from "react-router-dom";
import { Employee } from "../HR_States/EmployeeStates";
import { GradeService, Grade, EmployeeService } from "../HR_Service/HRServices";
import { EmployeeActionType } from "../HR_Actions/EmployeeReducer";
import { useNavigate } from 'react-router-dom';

type formMode = "add" | "edit";

const AddEmployee: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useContext(EmployeeContext);
  const { employeeId } = useParams<{ employeeId: string }>();
  
  const [formType, setFormType] = useState<formMode>("add"); 
  const [grades, setGrades] = useState<Grade[]>([]);
  const [originalGradeId, setOriginalGradeId] = useState<number | null>(null);

  const [isValid, setIsValid] = useState(false); 
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [successOpen, setSuccessOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const data = location.state as  Employee | undefined;

  // Side effect for edit mode initialization
  useEffect(() => {
    if (employeeId || data){ 
      setFormType("edit"); 
      if (data){ 
      dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload : { field: "employee_id", value : data.employee_id }}); 
      dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: { field: "first_name", value: data.first_name } }); 
      dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: { field: "last_name", value: data.last_name }}); 
      dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: { field: "phone_number", value: data.phone_number }}); 
      dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: { field: "email_address", value: data.email_address }});
      dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: { field: "current_grade_id", value: data.current_grade_id }}); 
      dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: { field: "role", value: data.role } }); 
      setOriginalGradeId(data.current_grade_id);
      } 
    } 
  }, [employeeId, data, dispatch]);
 // load grades once 
  useEffect(() => {
    const loadGrades = async () => {
      try {
        const gradeList = await GradeService.fetchGrades();
        setGrades(gradeList);
      } catch (error) {
        console.error("Failed to load grades:", error);
      }
    };
    loadGrades();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    dispatch({ 
        type: EmployeeActionType.UPDATE_FIELD, 
        payload: {field: name as keyof typeof state, value },
    });
    
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    // first name
    if (!state.first_name.trim()) { 
      newErrors.first_name = "First name is required"; 
    }
    // last name
    if (!state.last_name.trim()) { 
      newErrors.last_name = "Last name is required"; 
    }
    // phone number
    if(!/^\d{10}$/.test(state.phone_number)){
      newErrors.phone_number = "Phone number must be 10 digits";
    }
    // email address
    if (!/^[a-zA-Z0-9]+@cognizant\.com$/.test(state.email_address)) {
      newErrors.email_address = "Email must be a valid cognizant.com address";
    }
    // DownGrade check
    if (formType === "edit" && originalGradeId !== null && state.current_grade_id > originalGradeId) {
        newErrors.current_grade_id = "Grade cannot be downgraded";
    }
    // Role
    if(state.role === "TravelDeskExe" && state.current_grade_id!= 1){
      newErrors.current_grade_id = "TravelDeskExe must have grade 1";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  // Re-run validation whenver state changes
  useEffect(() => {
    setIsValid(validateForm());
  }, [state, formType, originalGradeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid){ 
      setWarningOpen(true); 
      return;
    }
    try {
        if(formType === "add"){
          await EmployeeService.addEmployee(state);
          setSuccessOpen(true);         
        }
        else if(formType === "edit"){
          await EmployeeService.updateEmployee(state);  
          setUpdateOpen(true);      
        }
      
      }
      catch(error){
        console.error("Error submitting form:", error);
        setErrorOpen(true);
      }
    };

    const resetLocalValidation = () => {
      setTouched({});        // clears touched for all fields
      setErrors({});         // clears inline errors
      setIsValid(false);     // prevents button enable and warning
    };
    

  return (
    <>
    <Container maxWidth="sm">
    <Paper elevation={3} sx={{ p: 5, mt: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 5, maxWidth: 600, margin: "auto", backgroundColor: "white", borderRadius: 2 }}
      >
        <Typography variant="h5" gutterBottom>
          {formType === "add" ? "Add New Employee" : "Update Employee Grades"}
          </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            name="first_name"
            label="First Name"
            value={state.first_name}
            onChange={handleChange}
            fullWidth
            required
            error={touched.first_name && !!errors.first_name}
            helperText={touched.first_name ? errors.first_name : ""}
            disabled={formType === "edit"}
            
          />
          <TextField
            name="last_name"
            label="Last Name"
            value={state.last_name}
            onChange={handleChange}
            fullWidth
            required
            error={touched.last_name && !!errors.last_name}
            helperText={touched.last_name ? errors.last_name : ""}
            disabled={formType === "edit"}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            name="phone_number"
            label="Phone Number"
            value={state.phone_number}
            onChange={handleChange}
            fullWidth
            required
            error={touched.phone_number && !!errors.phone_number}
            helperText={touched.phone_number ? errors.phone_number : ""}
            disabled={formType === "edit"}
          />
          <TextField
            name="email_address"
            label="Email"
            value={state.email_address}
            onChange={handleChange}
            fullWidth
            required
            error={touched.email_address && !!errors.email_address}
            helperText={touched.email_address ? errors.email_address : ""}
            disabled={formType === "edit"}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth variant="outlined" 
            error={touched.current_grade_id && !!errors.current_grade_id} 
          >
            <InputLabel id="grade-label">Grade</InputLabel>
            <Select
              labelId="grade-label"
              name="current_grade_id"
              value={state.current_grade_id || ""}
              onChange={(e) =>
                dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: {field: "current_grade_id", value: Number(e.target.value)} })      
              }
              label="Grade"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Grade
              </MenuItem>
              {grades.map((grade) => (
                <MenuItem key={grade.id} 
                          value={grade.id}
                          disabled={formType === "edit" && originalGradeId != null && grade.id < Number(originalGradeId)}>
                  {grade.name}
                </MenuItem>
              ))}
              
            </Select>
            {touched.current_grade_id && errors.current_grade_id &&(
              <Typography variant="caption" color="error">
                {errors.current_grade_id}
              </Typography>
            )}
          </FormControl>
        </Box>
        <Typography variant="subtitle1">Select Role</Typography>
        <RadioGroup
          row
          name="role"
          value={state.role}
          onChange={(e) => dispatch({ type: EmployeeActionType.UPDATE_FIELD, payload: {field: "role", value: e.target.value} })}
        >
          <FormControlLabel value="HR" control={<Radio />} label="HR" disabled={formType === "edit"} />
          <FormControlLabel value="TravelDeskExe" control={<Radio />} label="TravelDeskExe" disabled={formType === "edit"} />
          <FormControlLabel value="Employee" control={<Radio />} label="Employee" disabled={formType === "edit"} />
        </RadioGroup>
    
        <Grid container spacing={4}
        sx ={{
          justifyContent: 'center',
        }}
        >
     
      <Grid size ={{xs:12, sm:8, md: 4}}>
        <Button fullWidth variant="contained" 
          color="primary" type="submit"
          disabled={!isValid}
        >
          {
          formType === "add" ? "SUBMIT" : " UPDATE"
          }
        </Button>
      </Grid>
    </Grid>
      </Box>
      </Paper>
    </Container>
      <CustomModal
        open={successOpen}
        onClose={() => {
        setSuccessOpen(false);
        dispatch({
          type: EmployeeActionType.RESET_FORM
        });
        navigate('/add-employee')
        }}
        title={modalMessages.AddEmployee.success.title}
        message={modalMessages.AddEmployee.success.message}
        color={modalMessages.AddEmployee.success.color}
      />
      <CustomModal 
        open={updateOpen}
        onClose={() => {
          setUpdateOpen(false)
          dispatch({
            type: EmployeeActionType.RESET_FORM
          });
          navigate('/employee-detail');
        }}
        title={modalMessages.AddEmployee.update.title}
        message={modalMessages.AddEmployee.update.message}
        color={modalMessages.AddEmployee.update.color}
      />
      <CustomModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title={modalMessages.AddEmployee.error.title}
        message={modalMessages.AddEmployee.error.message}
        color={modalMessages.AddEmployee.error.color}
      />
      <CustomModal
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        title={modalMessages.AddEmployee.warning.title}
        message={modalMessages.AddEmployee.warning.message}
        color={modalMessages.AddEmployee.warning.color}
      />
    </>
  );
};

export default AddEmployee;
