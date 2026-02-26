import React, { useContext, useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ReservationContext } from "../Context/ReservationContext";

const TrackReservation = () => {
  const { state, dispatch } = useContext(ReservationContext);
  const [travelRequestId, setTravelRequestId] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!travelRequestId) return;

    dispatch({ type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID" });

    // 👉 Call your API here and then dispatch SUCCESS or FAILURE
    // Example:
    /*
    reservationService
      .getReservationsByTravelRequestId(Number(travelRequestId))
      .then((res) =>
        dispatch({
          type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_SUCCESS",
          payload: res.data,
        })
      )
      .catch((err) =>
        dispatch({
          type: "FETCH_RESERVATIONS_BY_TRAVELREQUEST_ID_FAILURE",
          payload: "Failed to fetch reservations",
        })
      );
    */
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Track Reservation
      </Typography>

      {/* SEARCH SECTION */}
      <Grid container spacing={3} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Enter Travel Request ID"
            value={travelRequestId}
            onChange={(e) => setTravelRequestId(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={state.loading}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* LOADER */}
      {state.loading && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      )}

      {/* ERROR */}
      {state.error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {state.error}
        </Alert>
      )}

      {/* RESULTS */}
      {!state.loading && state.reservations.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {state.reservations.map((reservation) => (
            <Grid key={reservation.id} size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Reservation ID: {reservation.id}
                  </Typography>

                  <Typography>
                    Entity: {reservation.reservationDoneWithEntity}
                  </Typography>

                  <Typography>
                    Date: {reservation.reservationDate}
                  </Typography>

                  <Typography>
                    Amount: ₹ {reservation.amount}
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
      )}

      {/* NO RESULTS */}
      {!state.loading &&
        state.reservations.length === 0 &&
        travelRequestId && (
          <Typography sx={{ mt: 3 }}>
            No reservations found.
          </Typography>
        )}
    </Box>
  );
};

export default TrackReservation;