import React, { useEffect, useReducer, useState } from "react";
import {
  Box, Button, CircularProgress, Container, Chip, Divider,
  Paper, TextField, Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Common/Loader";
import CustomModal from "../../Common/Modals";
import modalMessage from "../Resources/ReimbursementRespurce.json";
import { ReimbursementRequests } from "../States/ReimbursementStates";
import { ReimbursementReducer } from "../Actions/ReimbursementReducer";
import { initialReimbursementState } from "../States/ReimbursementStates";
import dayjs from "dayjs";

// ── Detail Row Helper ──────────────────────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <>
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
    <Divider />
  </>
);

// ── Component ──────────────────────────────────────────────────────────────
const ProcessReimbursement: React.FC = () => {
  const { reimbursementId } = useParams<{ reimbursementId: string }>();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(ReimbursementReducer, initialReimbursementState);

  const [detail, setDetail] = useState<ReimbursementRequests | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");

  const [approvedOpen, setApprovedOpen] = useState(false);
  const [rejectedOpen, setRejectedOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  // ── Fetch Detail ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/Reimbursement/${reimbursementId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ReimbursementRequests = await res.json();
        setDetail(data);
      } catch (err) {
        console.error("Error fetching reimbursement detail:", err);
        setErrorOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [reimbursementId]);

  // ── Process Handler ────────────────────────────────────────────────────
  const handleProcess = async (action: "Approved" | "Rejected") => {
    if (action === "Rejected" && !remarks.trim()) {
      setRemarksError("Remarks are mandatory when rejecting a reimbursement.");
      return;
    }
    setRemarksError("");
    setSubmitting(true);

    dispatch({ type: "CREATE_REIMBURSEMENT_REQUEST" });

    try {
      const res = await fetch(
        `http://localhost:5000/api/Reimbursement/${reimbursementId}/process`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: action,
            remarks: remarks.trim(),
            request_processed_on: new Date(),
          }),
        }
      );

      if (!res.ok) throw new Error("Processing failed");

      dispatch({
        type: "SUCCESS_CREATE_REIMBURSEMENT",
        payload: `Reimbursement ${action} successfully`,
      });

      action === "Approved" ? setApprovedOpen(true) : setRejectedOpen(true);

    } catch (err) {
      console.error("Error processing reimbursement:", err);
      dispatch({ type: "FAILURE_CREATE_REIMBURSEMENT", payload: "Processing failed" });
      setErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "success";
      case "Rejected": return "error";
      default: return "warning";
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4, maxWidth: 800, mx: "auto" }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 5, borderRadius: 3, backgroundColor: "#ffffff" }}>

            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
              Process Reimbursement
            </Typography>

            {detail ? (
              <>
                {/* ── Reimbursement Details ── */}
                <DetailRow label="Reimbursement ID"  value={detail.id ?? "—"} />
                <DetailRow label="Travel Request ID"  value={detail.travel_request_id} />
                <DetailRow label="Employee ID"        value={detail.request_raised_by_employee_id} />
                <DetailRow label="Reimbursement Type" value={detail.reimbursement_type_id} />
                <DetailRow label="Invoice No."        value={detail.invoice_no} />
                <DetailRow label="Invoice Date"       value={dayjs(detail.invoice_date).format("DD-MMM-YYYY")} />
                <DetailRow label="Amount (INR)"       value={`₹ ${Number(detail.invoice_amount).toLocaleString("en-IN")}`} />
                <DetailRow label="Request Date"       value={dayjs(detail.request_date).format("DD-MMM-YYYY")} />

                {/* ── Status ── */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Status
                  </Typography>
                  <Chip
                    label={detail.status || "Pending"}
                    color={getStatusColor(detail.status) as any}
                    size="small"
                    sx={{ fontSize: "0.75rem" }}
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* ── Already Processed ── */}
                {detail.status === "Approved" || detail.status === "Rejected" ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", mt: 1 }}
                  >
                    This reimbursement has already been{" "}
                    <strong>{detail.status}</strong>.
                  </Typography>
                ) : (
                  <>
                    {/* ── Remarks ── */}
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Remarks"
                      placeholder="Add remarks (mandatory for rejection)"
                      value={remarks}
                      onChange={(e) => {
                        setRemarks(e.target.value);
                        if (remarksError) setRemarksError("");
                      }}
                      error={!!remarksError}
                      helperText={remarksError || "Required if rejecting"}
                      sx={{ mb: 3 }}
                    />

                    {/* ── Action Buttons ── */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                      <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={() => handleProcess("Approved")}
                        sx={{
                          py: 1.2, px: 4, fontWeight: 600,
                          backgroundColor: "#2e7d32",
                          "&:hover": { backgroundColor: "#1b5e20" },
                        }}
                      >
                        {submitting
                          ? <CircularProgress size={22} color="inherit" />
                          : "Approve"
                        }
                      </Button>

                      <Button
                        variant="contained"
                        disabled={submitting}
                        onClick={() => handleProcess("Rejected")}
                        sx={{
                          py: 1.2, px: 4, fontWeight: 600,
                          backgroundColor: "#c0392b",
                          "&:hover": { backgroundColor: "#922b21" },
                        }}
                      >
                        {submitting
                          ? <CircularProgress size={22} color="inherit" />
                          : "Reject"
                        }
                      </Button>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <Typography color="error" sx={{ textAlign: "center" }}>
                Reimbursement details could not be loaded.
              </Typography>
            )}

          </Paper>
        </Container>
      </Box>

      {/* ── Modals ── */}
      <CustomModal
  open={approvedOpen}
  onClose={() => { setApprovedOpen(false); navigate(-1); }}
  title={modalMessage.AddReimbursement.approved.title}
  message={modalMessage.AddReimbursement.approved.message}
  color={modalMessage.AddReimbursement.approved.color}
/>
<CustomModal
  open={rejectedOpen}
  onClose={() => { setRejectedOpen(false); navigate(-1); }}
  title={modalMessage.AddReimbursement.rejected.title}
  message={modalMessage.AddReimbursement.rejected.message}
  color={modalMessage.AddReimbursement.rejected.color}
/>
<CustomModal
  open={errorOpen}
  onClose={() => setErrorOpen(false)}
  title={modalMessage.AddReimbursement.error.title}
  message={modalMessage.AddReimbursement.error.message}
  color={modalMessage.AddReimbursement.error.color}
/>
    </>
  );
};

export default ProcessReimbursement;