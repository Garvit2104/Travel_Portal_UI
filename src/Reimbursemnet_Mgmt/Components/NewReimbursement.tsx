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
} from "@mui/material";

import { ReimbursementContext } from "../Context/ReimbursementContext";

const NewReimbursement = () => {
    const {state, dispatch} = useContext(ReimbursementContext);

    const [formData, setFormData] = useState({
        travelRequestId: "",
        requestRaisedByEmployeeId: "",
        reimbursementTypeId: "",
        invoiceNumber: "",
        invoiceDate: "",
        invoiceAmount: ""  
    });

    const [document, setDocument] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
        case "travelRequestId":
            if (!value.trim()) {
                newErrors.travelRequestId = "Travel Request ID is required";
            } else {
                delete newErrors.travelRequestId;
            }
            break;

        case "requestRaisedByEmployeeId":
            if (!value.trim()) {
                newErrors.requestRaisedByEmployeeId = "Employee ID is required";
            } else {
                delete newErrors.requestRaisedByEmployeeId;
            }
            break;

        case "reimbursementTypeId":
            if (!value.trim()) {
                newErrors.reimbursementTypeId = "Reimbursement Type is required";
            } else {
                delete newErrors.reimbursementTypeId;
            }
            break;

        case "invoiceNumber":
            const invoiceNumberRegex = /^[A-Za-z0-9\-\/]+$/;
            if (!value.trim()) {
                newErrors.invoiceNumber = "Invoice Number is required";
            } else if (!invoiceNumberRegex.test(value)) {
                newErrors.invoiceNumber = "Only letters, numbers, - or / allowed";
            } else {
                delete newErrors.invoiceNumber;
            }
            break;

        case "invoiceDate":
            if (!value.trim()) {
                newErrors.invoiceDate = "Invoice Date is required";
            } else {
                delete newErrors.invoiceDate;
            }
            break;

        case "invoiceAmount":
            const invoiceAmountRegex = /^\d+(\.\d{1,2})?$/;
            if (!value.trim()) {
                newErrors.invoiceAmount = "Invoice Amount is required";
            } else if (!invoiceAmountRegex.test(value)) {
                newErrors.invoiceAmount = "Enter a valid amount (e.g. 1000 or 1000.50)";
            } else {
                // ✅ Amount range check per reimbursement type
                const amount = parseFloat(value);
                if (!isNaN(amount)) {
                    if (formData.reimbursementTypeId === "1") {
                        if (amount < 1000 && amount > 1500) {       
                            newErrors.invoiceAmount = "Food & Water must be between ₹1000 and ₹1500";
                        } else {
                            delete newErrors.invoiceAmount;
                        }
                    } else if (formData.reimbursementTypeId === "2") {
                        if (amount < 250 && amount > 500) {            
                            newErrors.invoiceAmount = "Laundry must be between ₹250 and ₹500";
                        } else {
                            delete newErrors.invoiceAmount;
                        }
                    } else if (formData.reimbursementTypeId === "3") {
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
        if (!formData.travelRequestId) {
            newErrors.travelRequestId = "Travel Request ID is required";
        }
        if (!formData.requestRaisedByEmployeeId) {
            newErrors.requestRaisedByEmployeeId = "Employee ID is required";
        }
        if (!formData.reimbursementTypeId) {
            newErrors.reimbursementTypeId = "Reimbursement Type is required";
        }
        if (!formData.invoiceNumber) {
            newErrors.invoiceNumber = "Invoice Number is required";
        }
        if (!formData.invoiceDate) {
            newErrors.invoiceDate = "Invoice Date is required";
        }
        if (!formData.invoiceAmount) {
            newErrors.invoiceAmount = "Invoice Amount is required";
        }
        // Invoice Number Regex
        const invoiceNumberRegex = /^[A-Za-z0-9\-\/]+$/;
        if(formData.invoiceNumber && !invoiceNumberRegex.test(formData.invoiceNumber)) {
            newErrors.invoiceNumber = "Invoice Number can only contain letters, numbers, hyphens and slashes";
        }

        // Invoice Amount should be positive number
        const invoiceAmountRegex = /^\d+(\.\d{1,2})?$/;
        if(formData.invoiceAmount && !invoiceAmountRegex.test(formData.invoiceAmount)) {
            newErrors.invoiceAmount = "Enter a Valid Invoice Amount";
        }
        // document
        if(!document){
            newErrors.document = "Invoice DOcument is required";
        }else{
            const allowedExtensions = /\.pdf$/i;
            if(!allowedExtensions.test(document.name)){
                newErrors.document = "Only PDF files are allowed";
            }
        }

        // Amount
        const amount = parseFloat(formData.invoiceAmount);
        if(!isNaN(amount)){
            if(formData.reimbursementTypeId === "1"){
                if(amount < 1000 && amount > 1500){
                    newErrors.invoiceAmount = "Food & Water expense must be between ₹1000 and ₹1500";
                }
            }else if(formData.reimbursementTypeId === "2"){
                if(amount < 250 && amount > 500){
                    newErrors.invoiceAmount = "Laundry expense must be between ₹250 and ₹500";
                }
            }else if(formData.reimbursementTypeId === "3"){
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
            setDocument(e.target.files[0]);
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
    // ✅ safe to make API call here
};

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
                New Reimbursement Request
        </Typography>
        <form>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth required
                        label="Travel Request ID"
                        name="travelRequestId"
                        type="number"
                        value={formData.travelRequestId}
                        onChange={handleTextChange}  
                        onBlur={handleBlur}
                        error={!!errors.travelRequestId}   // FIX: error handling
                        helperText={errors.travelRequestId}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth required
                        label="Employee ID"
                        name="requestRaisedByEmployeeId"
                        type="number"
                        value={formData.requestRaisedByEmployeeId}
                        onChange={handleTextChange}   
                        onBlur={handleBlur}
                        error={!!errors.requestRaisedByEmployeeId}
                        helperText = {errors.requestRaisedByEmployeeId}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth error={!!errors.reimbursementTypeId}>
                        <InputLabel>Reimbursement Type</InputLabel>
                        <Select
                            name="reimbursementTypeId"
                            value={formData.reimbursementTypeId} 
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
                        <FormHelperText>{errors.reimbursementTypeId}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth
                        label="Invoice Number"
                        name="invoiceNumber"
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        error={!!errors.invoiceNumber}
                        helperText={errors.invoiceNumber}
                    />
                </Grid>
        
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth
                        label="Amount (INR)"
                        name="invoiceAmount"
                        type="number"
                        value={formData.invoiceAmount}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        error={!!errors.invoiceAmount}
                        helperText={errors.invoiceAmount}
                        />
                </Grid>
        
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField fullWidth 
                        label=""
                        type="date"
                        name="invoiceDate"
                        value={formData.invoiceDate}
                        onChange={handleTextChange} 
                        onBlur={handleBlur}
                        error={!!errors.invoiceDate}
                        helperText={errors.invoiceDate}
                     />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button variant="outlined" component="label">
                        Upload Document
                        <input type="file" hidden
                            accept="application/pdf"
                            onChange={handleFileChange}
                        />
                    </Button>
                    {errors.document && 
                        ( 
                        <Typography color = "error">
                            {errors.document}
                        </Typography>
                    )}
                    {document && 
                    (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {document.name} ({(document.size / 1024).toFixed(1)} KB)
                        </Typography>
                    )}         
                            
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <Button variant="contained"
                        type="submit"
                    >
                    Submit Reimbursement
                    </Button>
                </Grid>
            </Grid>
        </form>
    </Box>

    
  )
}
export default NewReimbursement;
