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
  Alert,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { ReservationContext } from "../Context/ReservationContext";
import { useParams } from "react-router-dom";

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

  useEffect(() => {
    dispatch({ type: "FETCH_REQUEST_TYPE" });
  }, [dispatch]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(formData.amount) <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (file) {
      data.append("file", file);
    }

    dispatch({ type: "CREATE_RESERVATION_REQUEST" });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload Reservation
      </Typography>

      {state.successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.successMessage}
        </Alert>
      )}

      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Employee ID"
              name="reservationDoneByEmployeeId"
              type="number"
              value={formData.reservationDoneByEmployeeId}
              onChange={handleTextChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
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
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Reserved With (Entity)"
              name="reservationDoneWithEntity"
              value={formData.reservationDoneWithEntity}
              onChange={handleTextChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Reservation Date"
              type="date"
              name="reservationDate"
              InputLabelProps={{ shrink: true }}
              value={formData.reservationDate}
              onChange={handleTextChange}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleTextChange}
              required
              inputProps={{ min: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Confirmation ID"
              name="confirmationId"
              value={formData.confirmationId}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <TextField
              fullWidth
              label="Remarks"
              name="remarks"
              multiline
              rows={3}
              value={formData.remarks}
              onChange={handleTextChange}
            />
          </Grid>

          <Grid size={{ xs: 12}}>
            <Button variant="outlined" component="label">
              Upload Document
              <input
                type="file"
                hidden
                onChange={(e) =>
                  setFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </Button>

            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {file.name}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12}}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={state.loading}
            >
              {state.loading ? (
                <CircularProgress size={24} />
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