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
  SelectChangeEvent,
  Container,
  Paper,
} from "@mui/material";

import { ReimbursementContext } from "../Context/ReimbursementContext";
import modalMessage from '../Resources/ReimbursementRespurce.json';
import CustomModal from "../../Common/Modals";

const NewReimbursement = () => {
    const {state, dispatch} = useContext(ReimbursementContext);

    const [formData, setFormData] = useState({
        travel_request_id: "",
        request_raised_by_employee_id: "",
        reimbursement_type_id: "",
        invoice_number: "",
        invoice_date: "",
        invoice_amount: ""  
    });

    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
        case "travel_request_id":
            if (!value.trim()) {
                newErrors.travelRequestId = "Travel Request ID is required";
            } else {
                delete newErrors.travelRequestId;
            }
            break;

        case "request_raised_by_employee_id":
            if (!value.trim()) {
                newErrors.requestRaisedByEmployeeId = "Employee ID is required";
            } else {
                delete newErrors.requestRaisedByEmployeeId;
            }
            break;

        case "reimbursement_type_id":
            if (!value.trim()) {
                newErrors.reimbursementTypeId = "Reimbursement Type is required";
            } else {
                delete newErrors.reimbursementTypeId;
            }
            break;

        case "invoice_number":
            const invoiceNumberRegex = /^[A-Za-z0-9\-\/]+$/;
            if (!value.trim()) {
                newErrors.invoiceNumber = "Invoice Number is required";
            } else if (!invoiceNumberRegex.test(value)) {
                newErrors.invoiceNumber = "Only letters, numbers, - or / allowed";
            } else {
                delete newErrors.invoiceNumber;
            }
            break;

        case "invoice_date":
            if (!value.trim()) {
                newErrors.invoiceDate = "Invoice Date is required";
            } else {
                delete newErrors.invoiceDate;
            }
            break;

        case "invoice_amount":
            const invoiceAmountRegex = /^\d+(\.\d{1,2})?$/;
            if (!value.trim()) {
                newErrors.invoiceAmount = "Invoice Amount is required";
            } else if (!invoiceAmountRegex.test(value)) {
                newErrors.invoiceAmount = "Enter a valid amount (e.g. 1000 or 1000.50)";
            } else {
                // ✅ Amount range check per reimbursement type
                const amount = parseFloat(value);
                if (!isNaN(amount)) {
                    if (formData.reimbursement_type_id === "1") {
                        if (amount < 1000 && amount > 1500) {       
                            newErrors.invoiceAmount = "Food & Water must be between ₹1000 and ₹1500";
                        } else {
                            delete newErrors.invoiceAmount;
                        }
                    } else if (formData.reimbursement_type_id === "2") {
                        if (amount < 250 && amount > 500) {            
                            newErrors.invoiceAmount = "Laundry must be between ₹250 and ₹500";
                        } else {
                            delete newErrors.invoiceAmount;
                        }
                    } else if (formData.reimbursement_type_id === "3") {
                        if (amount > 1000) {
                            newErrors.invoiceAmount = "Local Travel cannot exceed ₹1000";
                        } else {
                            delete newErrors.invoiceAmount;
                        }
                    } else {
                        delete newErrors.invoiceAmount;
                    }
                }
            }
            break;
    }

    setErrors(newErrors);
    };

    const validate = ():boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.travel_request_id) {
            newErrors.travelRequestId = "Travel Request ID is required";
        }
        if (!formData.request_raised_by_employee_id) {
            newErrors.requestRaisedByEmployeeId = "Employee ID is required";
        }
        if (!formData.reimbursement_type_id) {
            newErrors.reimbursementTypeId = "Reimbursement Type is required";
        }
        if (!formData.invoice_number) {
            newErrors.invoiceNumber = "Invoice Number is required";
        }
        if (!formData.invoice_date) {
            newErrors.invoiceDate = "Invoice Date is required";
        }
        if (!formData.invoice_amount) {
            newErrors.invoiceAmount = "Invoice Amount is required";
        }
        // Invoice Number Regex
        const invoiceNumberRegex = /^[A-Za-z0-9\-\/]+$/;
        if(formData.invoice_number && !invoiceNumberRegex.test(formData.invoice_number)) {
            newErrors.invoiceNumber = "Invoice Number can only contain letters, numbers, hyphens and slashes";
        }

        // Invoice Amount should be positive number
        const invoiceAmountRegex = /^\d+(\.\d{1,2})?$/;
        if(formData.invoice_amount && !invoiceAmountRegex.test(formData.invoice_amount)) {
            newErrors.invoiceAmount = "Enter a Valid Invoice Amount";
        }
        // document
        if(!invoiceFile){
            newErrors.document = "Invoice Document is required";
        }else{
            const allowedExtensions = /\.pdf$/i;
            if(!allowedExtensions.test(invoiceFile.name)){
                newErrors.document = "Only PDF files are allowed";
            }
            else if (invoiceFile.size > 256 * 1024) {
                newErrors.document = "File size must not exceed 256KB";
      }
        }

        // Amount
        const amount = parseFloat(formData.invoice_amount);
        if(!isNaN(amount)){
            if(formData.reimbursement_type_id === "1"){
                if(amount < 1000 || amount > 1500){
                    newErrors.invoiceAmount = "Food & Water expense must be between ₹1000 and ₹1500";
                }
            }else if(formData.reimbursement_type_id === "2"){
                if(amount < 250 || amount > 500){
                    newErrors.invoiceAmount = "Laundry expense must be between ₹250 and ₹500";
                }
            }else if(formData.reimbursement_type_id === "3"){
                if(amount > 1000){
                    newErrors.invoiceAmount = "Local Travel expense cannot exceed ₹1000";   
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name, value} = e.target;
        setFormData((prevData) =>({
            ...prevData,
            [name]:  value
        }))
    }

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setInvoiceFile(e.target.files[0]);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        validateField(name, value);  // only validates the field user just left
    };

// ─── SELECT BLUR (MUI Select has its own blur event) ─────────────────────
    const handleSelectBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        const isValid = validate();   // validates ALL fields as final check
        if (!isValid) return;         // stop if any error exists
        
 
        setSubmitted(true);
  
};

  return (
    <>
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", p: 4, maxWidth: 800, mx: "auto" }}>
  <Container maxWidth="sm">
    <Paper elevation={3} sx={{ p: 5, borderRadius: 3, backgroundColor: "#ffffff" }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        New Reimbursement Request
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth required
              label="Travel Request ID"
              name="travel_request_id"
              type="number"
              value={formData.travel_request_id}
              onChange={handleTextChange}
              onBlur={handleBlur}
              error={!!errors.travel_request_id}
              helperText={errors.travel_request_id}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth required
              label="Employee ID"
              name="request_raised_by_employee_id"
              type="number"
              value={formData.request_raised_by_employee_id}
              onChange={handleTextChange}
              onBlur={handleBlur}
              error={!!errors.request_raised_by_employee_id}
              helperText={errors.request_raised_by_employee_id}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth error={!!errors.reimbursement_type_id}>
              <InputLabel>Reimbursement Type</InputLabel>
              <Select
                name="reimbursementTypeId"
                value={formData.reimbursement_type_id}
                label="Reimbursement Type"
                onChange={handleSelectChange}
                onBlur={handleSelectBlur}
              >
                {state.reimbursementTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.reimbursement_type_id}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth required
              label="Invoice Number"
              name="invoice_number"
              type="text"
              value={formData.invoice_number}
              onChange={handleTextChange}
              onBlur={handleBlur}
              error={!!errors.invoice_number}
              helperText={errors.invoice_number}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth
              label="Amount (INR)"
              name="invoice_amount"
              type="number"
              value={formData.invoice_amount}
              onChange={handleTextChange}
              onBlur={handleBlur}
              error={!!errors.invoice_amount}
              helperText={errors.invoice_amount}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth
              label="Invoice Date"
              type="date"
              name="invoice_date"
              InputLabelProps={{ shrink: true }}
              value={formData.invoice_date}
              onChange={handleTextChange}
              onBlur={handleBlur}
              error={!!errors.invoice_date}
              helperText={errors.invoice_date}
            />
          </Grid>

          {/* ── File Upload ── */}
          <Grid size={{ xs: 12 }} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Button variant="outlined" component="label"
              color={errors.document ? "error" : "primary"}
            >
              Upload Document
              <input type="file" hidden
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </Button>
            {invoiceFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                ✅ {invoiceFile.name} ({(invoiceFile.size / 1024).toFixed(1)} KB)
              </Typography>
            )}
            {errors.document && (
              <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                {errors.document}
              </Typography>
            )}
          </Grid>

          {/* ── Submit ── */}
          <Grid size={{ xs: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" type="submit"
              sx={{ mt: 1, py: 1.2, px: 4, fontWeight: 600, letterSpacing: 0.5, backgroundColor: "#1e4d8c", "&:hover": { backgroundColor: "#164080" } }}
            >
              Submit Reimbursement
            </Button>
          </Grid>

        </Grid>
      </form>
    </Paper>
  </Container>
</Box>
<CustomModal
        open={successOpen}
        onClose={() => { setSuccessOpen(false); }}
        title={modalMessage.AddReimbursement.success.title}
        message={modalMessage.AddReimbursement.success.message}
        color={modalMessage.AddReimbursement.success.color}
      />
      <CustomModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title={modalMessage.AddReimbursement.error.title}
        message={modalMessage.AddReimbursement.error.message}
        color={modalMessage.AddReimbursement.error.color}
      />
</>
    
  )
}
export default NewReimbursement;
