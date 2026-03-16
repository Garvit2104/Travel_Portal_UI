import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { ReservationContext } from "../Context/ReservationContext";
import { fetchReservationById, downloadReservationDocument} from "../Services/ReservationService";



const ReservationDetails = () => {
  const {state, dispatch} = useContext(ReservationContext);

  const { id } = useParams();
  const navigate = useNavigate();
   const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  

  useEffect(() => {
    const load = async () => {
      const reservationId = Number(id);

      // Guard: if id from URL is not a valid number, stop early
      if (!id || isNaN(reservationId)) return;

      dispatch({ type: "FETCH_RESERVATION_BY_ID" }); // sets loading: true in context
      try {
        // Calls GET /api/reservations/{id}
        const data = await fetchReservationById(reservationId);
        dispatch({ type: "FETCH_RESERVATION_BY_ID_SUCCESS", payload: data });
      } catch (err: any) {
        dispatch({ type: "FETCH_RESERVATION_BY_ID_FAILURE", payload: err.message });
      }
    };

    load();
    return () => {
      dispatch({ type: "CLEAR_SELECTED_RESERVATION" });
    };
  }, [id, dispatch]);

  const handleDownload = async () => {
    const reservationId = Number(id);
    setDownloading(true);
    setDownloadError(null);
    try {
      // The service creates a temporary object URL from the Blob and
      // programmatically clicks a hidden <a> tag to trigger the download
      await downloadReservationDocument(
        reservationId,
        `Reservation_${reservationId}_${state.selectedReservation?.reservationDoneWithEntity}.pdf`
      );
    } catch (err: any) {
      // ✅ FIX: Original used alert() for download errors — replaced with
      // inline error message so it matches the rest of the component's error style
      setDownloadError("Failed to download document. Please try again.");
    } finally {
      // Always reset downloading state whether it succeeded or failed
      setDownloading(false);
    }
  };

  if (!state.selectedReservation) {
    return (
      <Box sx={{ mt: 4, p: 4, textAlign: "center" }}>
        <Typography color="text.secondary">Reservation not found.</Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }
  

  if (state.loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (state.error){
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error" onClose={() => dispatch({ type: "CLEAR_MESSAGE" })}>{state.error}</Alert>
       <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      
      </Box>
    );
  }
const r = state.selectedReservation;

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <Typography variant="h5" fontWeight="bold">
          Reservation Details
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="h6">Reservation #{r.id}</Typography>
            {/* Show resolved type name — same lookup pattern as TrackReservation
                .find() searches reservationTypes array for the matching typeId
                ?? "Unknown" is the fallback if the type is not found */}
            <Chip
              label={
                state.reservationTypes.find(
                  (t) => t.typeId === r.reservationTypeId
                )?.typeName ?? "Unknown"
              }
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        <Divider sx={{ mb: 2 }} />
         <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Travel Request ID:</strong> {r.travelRequestId}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Entity:</strong> {r.reservationDoneWithEntity}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Date:</strong>{" "}
            {/* ✅ FIX: Raw ISO string formatted to readable date e.g. 15 March 2024 */}
            {new Date(r.reservationDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Amount:</strong>{" "}
            {/* ✅ FIX: toLocaleString adds commas e.g. ₹10,000 instead of ₹10000 */}
            ₹{r.amount.toLocaleString("en-IN")}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Confirmation ID:</strong> {r.confirmationId}
          </Typography>
          {r.remarks && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Remarks:</strong> {r.remarks}
            </Typography>
          )}

          {r.createdOn && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Created On:</strong>{" "}
              {new Date(r.createdOn).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
          {downloadError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setDownloadError(null)}
          >
            {downloadError}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            // Show spinner inside button during download — this is appropriate here
            // because download is a quick action tied directly to this button,
            // unlike the page-level search which affects the whole content area
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
              Downloading...
            </>
          ) : (
            "Download Document"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ReservationDetails;