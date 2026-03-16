import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReservationContext } from "../Context/ReservationContext";
import { fetchReservationsByTravelRequestId } from "../Services/ReservationService";

const TrackReservation = () => {
  const { state, dispatch } = useContext(ReservationContext);
  const navigate = useNavigate();
  
  const [travelRequestId, setTravelRequestId] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

   const [inputError, setInputError] = useState("");

  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => dispatch({ type: "CLEAR_MESSAGE" }), 5000);
      return () => clearTimeout(timer); // cancel timer if component unmounts
    }
  }, [state.error, dispatch]);


  const handleSearch = async() => {
    if (!travelRequestId.trim()){
      setInputError("Travel Request ID is required");
      return;
    }

    const id = Number(travelRequestId);

    // Make sure the entered value is actually a valid number
    if (isNaN(id) || id <= 0) {
      setInputError("Please enter a valid numeric Travel Request ID.");
      return;
    }
    setInputError("");
    setHasSearched(true);

    dispatch({ type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID" });

    try {
      const data = await fetchReservationsByTravelRequestId(id);
      dispatch({
        type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_SUCCESS",
        payload: data,
      });
    } catch (err: any) {
      dispatch({
        type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_FAILURE",
        payload: err.message,
      });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Track Reservation
      </Typography>

    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter your Travel Request ID to view all reservations made for your trip.
      </Typography>

      {/* SEARCH SECTION */}
      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Enter Travel Request ID"
            type="number"
            value={travelRequestId}
            onChange={(e) => {setTravelRequestId(e.target.value);
            setInputError("")
            }}
            onKeyDown={handleKeyDown}
            error={!!inputError}
            helperText={inputError}
            disabled={state.loading}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={state.loading}
            sx={{ height: 56 }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* LOADER */}
      {state.loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ERROR */}
      {state.error && (
        <Alert severity="error" sx={{ mt: 3 }} 
        onClose={() => dispatch({ type: "CLEAR_MESSAGE" })}>
          {state.error}
        </Alert>
      )}

      {/* RESULTS */}
      {!state.loading && state.reservations.length > 0 && (
        <>
           <Typography variant="body2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
            Found <strong>{state.reservations.length}</strong> reservation(s) for
            Travel Request ID <strong>{travelRequestId}</strong>
          </Typography>
        <Grid container spacing={3}>
          {state.reservations.map((reservation) => (
            <Grid key={reservation.id} size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">
                    Reservation #{reservation.id}
                  </Typography>
                    <Chip
                      label={
                        state.reservationTypes.find(
                          (t) => t.typeId === reservation.reservationTypeId
                        )?.typeName ?? "Unknown"
                      }
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 1.5 }}
                    />

                   <Typography variant="body2" color="text.secondary">
                      <strong>Entity:</strong> {reservation.reservationDoneWithEntity}
                    </Typography>

                  <Typography variant="body2" color="text.secondary">
                      <strong>Date:</strong>{" "}
                      {/* ✅ FIX: Original displayed raw ISO date string (e.g. 2024-03-15T00:00:00)
                          Now formatted to a readable format e.g. 15 March 2024 */}
                      {new Date(reservation.reservationDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Amount:</strong> ₹ {reservation.amount.toLocaleString("en-IN")}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                      <strong>Confirmation ID:</strong> {reservation.confirmationId}
                  </Typography>

              
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      navigate(`/reservation-details/${reservation.id}`)
                    }
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        </> 
      )}

      {/* NO RESULTS */}
      {!state.loading && hasSearched && state.reservations.length === 0 && !state.error && (
        <Typography color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
          No reservations found for Travel Request ID <strong>{travelRequestId}</strong>.
        </Typography>
      )}
    </Box>
  );
};

export default TrackReservation;