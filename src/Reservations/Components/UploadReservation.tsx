import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Alert,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { ReservationContext } from "../Context/ReservationContext";
import { useNavigate, useParams } from "react-router-dom";
import { fetchReservationTypes, createReservation } from "../Services/ReservationService";
import modalMessages from "../Resources/Reservation.json";
import CustomModal from "../../Common/Modals";



const UploadReservation = () => {
  const { state, dispatch } = useContext(ReservationContext);
  const { travelRequestId } = useParams();
   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reservation_done_by_employee_id: "",
    travel_request_id: travelRequestId || "",
    reservation_type_id: "",
    reservation_done_with_entity: "",
    reservation_date: "",
    amount: "",
    confirmation_id: "",
    remarks: "",
  });

  const [file, setFile] = useState<File | null>(null);
   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  useEffect(() => {
     const loadTypes = async () => {
      dispatch({ type: "FETCH_REQUEST_TYPE" });
      try {
        const types = await fetchReservationTypes(); 
        dispatch({ type: "FETCH_REQUEST_TYPE_SUCCESS", payload: types });
      } catch (err: any) {
        dispatch({ type: "FETCH_REQUEST_TYPE_FAILURE", payload: err.message });
      }
    };
    loadTypes();
  }, [dispatch]);

  useEffect(() => {
      if (state.successMessage || state.error) {
        const timer = setTimeout(() => dispatch({ type:   "CLEAR_MESSAGE" }), 5000);
        return () => clearTimeout(timer);
      }
    }, [state.successMessage, state.error, dispatch]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "", // Clear error message for this field on change
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [name]: "", // Clear error message for this field on change
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setValidationErrors((prev) => ({
      ...prev,
      file: "", // Clear file error on change
    }));
  };

   const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.reservation_done_by_employee_id.trim())
      errors.reservation_done_by_employee_id = "Employee ID is required.";

    if (!formData.travel_request_id.trim())
      errors.travel_request_id = "Travel Request ID is required.";

    if (!formData.reservation_type_id)
      errors.reservation_type_id = "Please select a reservation type.";

    // if (!formData.reservation_done_with_entity.trim())
    //   errors.reservationDoneWithEntity = "Entity name is required.";

    if (!formData.reservation_date)
      errors.reservationDate = "Reservation date is required.";

    if (!formData.amount || Number(formData.amount) <= 0)
      errors.amount = "Amount must be a positive number.";


    if (!file) {
      errors.file = "Please upload a reservation document.";
    } else if (file.type !== "application/pdf") {
      errors.file = "Only PDF files are allowed.";
    } else if (file.size > 1 * 1024 * 1024) {
      errors.file = "File size must not exceed 1MB.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // true = no errors = safe to submit
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()){
    setWarningOpen(true);
    return;
  } 
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => data.append(key, value));
  if (file) data.append("file", file); // "file" must match the C# parameter name

  dispatch({ type: "CREATE_RESERVATION_REQUEST" }); // sets loading: true in state
  try {
    const message = await createReservation(data); // calls POST /api/reservations/add
    dispatch({ type: "CREATE_RESERVATION_SUCCESS", payload: message });
    setSuccessOpen(true);
    // Reset the form back to empty on success
    setFormData({
        reservation_done_by_employee_id: "",
        travel_request_id: travelRequestId || "",
        reservation_type_id: "",
        reservation_done_with_entity: "",
        reservation_date: "",
        amount: "",
        confirmation_id: "",
        remarks: "",
    });
    setFile(null);
  } catch (err: any) {
    dispatch({ type: "CREATE_RESERVATION_FAILURE", payload: err.message });
    setErrorOpen(true);
  }
};


  return (
    <>
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Upload Reservation
      </Typography>

      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Employee ID"
              name="reservation_done_by_employee_id"
              type="number"
              value={formData.reservation_done_by_employee_id}
              onChange={handleTextChange}
              required
              error={!!validationErrors.reservationDoneByEmployeeId}
              // !! converts string → boolean: "" = false, "error msg" = true
              helperText={validationErrors.reservationDoneByEmployeeId}
              // helperText shows the error message string below the field
            />
          </Grid>

          {/* ── Travel Request ID ────────────────────────────────────────────── */}
         
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Travel Request ID"
              name="travel_request_id"
              type="number"
              value={formData.travel_request_id}
              onChange={handleTextChange}
              required
              // If the ID came from the URL, lock it so user can't change it
              disabled={!!travelRequestId}
              error={!!validationErrors.travelRequestId}
              helperText={validationErrors.travelRequestId}
            />
          </Grid>

          {/* ── Reservation Type ─────────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required error={!!validationErrors.reservationTypeId}>
              <InputLabel>Reservation Type</InputLabel>
              <Select
                name="reservation_type_id"
                value={formData.reservation_type_id}
                onChange={handleSelectChange}
                label="Reservation Type"
              >
                {state.reservationTypes.map((type) => (
                  <MenuItem key={type.type_id} value={type.type_id}>
                    {type.type_name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{validationErrors.reservationTypeId}</FormHelperText>
            </FormControl>
          </Grid>

          {/* ── Reserved With (Entity) ───────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Reserved With (Entity)"
              name="reservation_done_with_entity"
              placeholder="e.g. IndiGo Airlines / Taj Hotel"
              value={formData.reservation_done_with_entity}
              onChange={handleTextChange}
              required
              error={!!validationErrors.reservationDoneWithEntity}
              helperText={validationErrors.reservationDoneWithEntity}
            />
          </Grid>

          {/* ── Reservation Date ─────────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Reservation Date"
              type="date"
              name="reservation_date"
              InputLabelProps={{ shrink: true }}
              // shrink: true keeps the label above the field when a date is shown
              // without it the label overlaps the date value
              value={formData.reservation_date}
              onChange={handleTextChange}
              required
              error={!!validationErrors.reservationDate}
              helperText={validationErrors.reservationDate}
            />
          </Grid>

          {/* ── Amount ──────────────────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Amount (INR)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleTextChange}
              required
              inputProps={{ min: 1 }}
              error={!!validationErrors.amount}
              helperText={validationErrors.amount}
            />
          </Grid>

          {/* ── Remarks (optional) ──────────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Remarks (Optional)"
              name="remarks"
              multiline
              rows={3}
              value={formData.remarks}
              onChange={handleTextChange}
            />
          </Grid>

          {/* ── File Upload ──────────────────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            {/* component="label" makes the Button act as a file input trigger
                The hidden <input> opens the file browser when Button is clicked */}
            <Button
              variant="outlined"
              component="label"
              color={validationErrors.file ? "error" : "primary"}
            >
              Upload Document (PDF, max 1MB)
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Button>

            {/* Show selected file name and size once the user picks a file */}
            {file && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ✅ {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </Typography>
            )}

            {/* Show file validation error (wrong type or too large) */}
            {validationErrors.file && (
              <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                {validationErrors.file}
              </Typography>
            )}
          </Grid>

          {/* ── Submit Button ────────────────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              // Disabled while API call is in progress to prevent duplicate submissions
              disabled={state.loading}
            >
              {/* ✅ FIX: CircularProgress was commented out in the original
                  Restored it — shows spinner during loading, label when idle */}
              {state.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Reservation"
              )}
            </Button>
          </Grid>

        </Grid>
      </form>
    </Box>
     <CustomModal
        open={successOpen}
        onClose={() => { setSuccessOpen(false); navigate('/'); }}
        title={modalMessages.AddReservation.success.title}
        message={modalMessages.AddReservation.success.message}
        color={modalMessages.AddReservation.success.color}
      />
      <CustomModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title={modalMessages.AddReservation.error.title}
        message={modalMessages.AddReservation.error.message}
        color={modalMessages.AddReservation.error.color}
      />
      <CustomModal
        open={warningOpen}
        onClose={() => setWarningOpen(false)}
        title={modalMessages.AddReservation.warning.title}
        message={modalMessages.AddReservation.warning.message}
        color={modalMessages.AddReservation.warning.color}
      /> 
      </>
  );
};

export default UploadReservation;