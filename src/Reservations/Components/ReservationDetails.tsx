import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";

interface Reservation {
  id: string;
  travelRequestId: string;
  reservationTypeId: string;
  reservationDoneWithEntity: string;
  reservationDate: string;
  amount: number;
  confirmationId: string;
  remarks: string;
}

const ReservationDetails = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservation();
  }, []);

  const fetchReservation = async () => {
    try {
      
      setLoading(false);
    } catch (err) {
      
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
    
    } catch (error) {
      alert("Failed to download document");
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Reservation Details
      </Typography>

      <Card>
        <CardContent>
          <Typography><strong>Reservation ID:</strong> {reservation?.id}</Typography>
          <Typography><strong>Travel Request ID:</strong> {reservation?.travelRequestId}</Typography>
          <Typography><strong>Reservation Type:</strong> {reservation?.reservationTypeId}</Typography>
          <Typography><strong>Entity:</strong> {reservation?.reservationDoneWithEntity}</Typography>
          <Typography><strong>Date:</strong> {reservation?.reservationDate}</Typography>
          <Typography><strong>Amount:</strong> ₹ {reservation?.amount}</Typography>
          <Typography><strong>Confirmation ID:</strong> {reservation?.confirmationId}</Typography>
          <Typography><strong>Remarks:</strong> {reservation?.remarks}</Typography>
        </CardContent>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
        >
          Download Document
        </Button>
      </Box>
    </Box>
  );
};

export default ReservationDetails;