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
import { useParams } from "react-router-dom";
import { fetchReservationTypes, createReservation } from "../Services/ReservationService";

const UploadReservation = () => {
  const { state, dispatch } = useContext(ReservationContext);
  const { travelRequestId } = useParams();

  const [formData, setFormData] = useState({
    reservationDoneByEmployeeId: "",
    travelRequestId: travelRequestId || "",
    reservationTypeId: "",
    reservationDoneWithEntity: "",
    reservationDate: "",
    amount: "",
    confirmationId: "",
    remarks: "",
  });

  const [file, setFile] = useState<File | null>(null);
   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
     const loadTypes = async () => {
      dispatch({ type: "FETCH_REQUEST_TYPE" });
      try {
        const types = await fetchReservationTypes(); // calls GET /api/reservations/types
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

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setValidationErrors((prev) => ({
      ...prev,
      [e.target.name]: "", // Clear error message for this field on change
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
      const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

    if (!formData.reservationDoneByEmployeeId.trim())
      errors.reservationDoneByEmployeeId = "Employee ID is required.";

    if (!formData.travelRequestId.trim())
      errors.travelRequestId = "Travel Request ID is required.";

    if (!formData.reservationTypeId)
      errors.reservationTypeId = "Please select a reservation type.";

    if (!formData.reservationDoneWithEntity.trim())
      errors.reservationDoneWithEntity = "Entity name is required.";

    if (!formData.reservationDate)
      errors.reservationDate = "Reservation date is required.";

    if (!formData.amount || Number(formData.amount) <= 0)
      errors.amount = "Amount must be a positive number.";

    if (!formData.confirmationId.trim())
      errors.confirmationId = "Confirmation ID is required.";

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
  if (!validate()) return;
  const data = new FormData();
  Object.entries(formData).forEach(([key, value]) => data.append(key, value));
  if (file) data.append("file", file); // "file" must match the C# parameter name

  dispatch({ type: "CREATE_RESERVATION_REQUEST" }); // sets loading: true in state
  try {
    const message = await createReservation(data); // calls POST /api/reservations/add
    dispatch({ type: "CREATE_RESERVATION_SUCCESS", payload: message });

    // Reset the form back to empty on success
    setFormData({
      reservationDoneByEmployeeId: "",
      travelRequestId: travelRequestId || "",
      reservationTypeId: "",
      reservationDoneWithEntity: "",
      reservationDate: "",
      amount: "",
      confirmationId: "",
      remarks: "",
    });
    setFile(null);
  } catch (err: any) {
    dispatch({ type: "CREATE_RESERVATION_FAILURE", payload: err.message });
  }
};


  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Upload Reservation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Fill in the details below to record a reservation made for an employee.
      </Typography>

      {/* Success alert — displayed when API returns acknowledgement */}
      {state.successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch({ type: "CLEAR_MESSAGE" })}>
          {state.successMessage}
        </Alert>
      )}

      {/* Error alert — displayed when API call fails */}
      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch({ type: "CLEAR_MESSAGE" })}>
          {state.error}
        </Alert>
      )}

      {/* noValidate disables browser's built-in HTML5 validation
          so our custom validate() is the only thing that runs on submit */}
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>

          {/* ── Employee ID ──────────────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Employee ID"
              name="reservationDoneByEmployeeId"
              type="number"
              value={formData.reservationDoneByEmployeeId}
              onChange={handleTextChange}
              required
              error={!!validationErrors.reservationDoneByEmployeeId}
              // !! converts string → boolean: "" = false, "error msg" = true
              helperText={validationErrors.reservationDoneByEmployeeId}
              // helperText shows the error message string below the field
            />
          </Grid>

          {/* ── Travel Request ID ────────────────────────────────────────────── */}
          {/* ✅ ADDED: This field was missing from the original form entirely */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Travel Request ID"
              name="travelRequestId"
              type="number"
              value={formData.travelRequestId}
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
            {/* FormControl groups InputLabel + Select + FormHelperText together
                so MUI can coordinate label position, error color, and spacing */}
            <FormControl fullWidth required error={!!validationErrors.reservationTypeId}>
              <InputLabel>Reservation Type</InputLabel>
              <Select
                name="reservationTypeId"
                value={formData.reservationTypeId}
                onChange={handleSelectChange}
                label="Reservation Type"
              >
                {state.reservationTypes.map((type) => (
                  <MenuItem key={type.typeId} value={type.typeId}>
                    {type.typeName}
                  </MenuItem>
                ))}
              </Select>
              {/* Select does not support helperText directly — must use FormHelperText */}
              <FormHelperText>{validationErrors.reservationTypeId}</FormHelperText>
            </FormControl>
          </Grid>

          {/* ── Reserved With (Entity) ───────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Reserved With (Entity)"
              name="reservationDoneWithEntity"
              placeholder="e.g. IndiGo Airlines / Taj Hotel"
              value={formData.reservationDoneWithEntity}
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
              name="reservationDate"
              InputLabelProps={{ shrink: true }}
              // shrink: true keeps the label above the field when a date is shown
              // without it the label overlaps the date value
              value={formData.reservationDate}
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

          {/* ── Confirmation ID ──────────────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Confirmation ID"
              name="confirmationId"
              placeholder="e.g. PNR123456"
              value={formData.confirmationId}
              onChange={handleTextChange}
              required
              error={!!validationErrors.confirmationId}
              helperText={validationErrors.confirmationId}
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
                // ✅ ADDED: accept limits the browser file picker to PDFs only
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
  );
};

export default UploadReservation;