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

import { ReimbursementContext } from "../Context/ReimbursementContext";

const NewReimbursemnet = () => {
    const {state, dispatch} = useContext(ReimbursementContext);

    const [formData, setFormData] = useState({
        travelRequestId: "",
        requestRaisedByEmployeeId: "",
        reimbursementTypeId: "",
        invoiceNumber: "",
        invoiceDate: "",
        invoiceAmount: ""  
    });

    const [document, setDocument] = useState<Document | null>(null);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
                New Reimbursement Request
        </Typography>
        <form>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Travel Request ID"
                        name="travelRequestId"
                        type="number"
                        value={formData.travelRequestId}
                        required   
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Employee ID"
                        name="requestRaisedByEmployeeId"
                        type="number"
                        value={formData.requestRaisedByEmployeeId}
                        required   
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth >
                        <InputLabel>Reimbursement Type</InputLabel>
                        <Select
                            name="reimbursementTypeId"
                            value={formData.reimbursementTypeId} 
                            label="Reimbursement Type"
                        >
                        {state.reimbursementTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                            ))}
                        </Select>                     
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Invoice Number"
                        name="invoiceNumber"
                        type="number"
                        value={formData.invoiceNumber}
                        required
                    />
                </Grid>
        
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Amount (INR)"
                        name="invoiceAmount"
                        type="number"
                        value={formData.invoiceAmount}
                        required
                        />
                </Grid>
        {/* ── Reimbursement  Date ─────────────────────────────────────────────── */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Invoice Date"
                        type="date"
                        name="invoiceDate"
                        value={formData.invoiceDate}
                        required 
                     />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button
                        variant="outlined"
                        component="label"
                    >
                    Upload Document (PDF, max 1MB)
                    <input
                        type="file"
                        hidden
                        accept="application/pdf"
                                
                    />
                    </Button>
                    {document && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {document.name} ({(document.size / 1024).toFixed(1)} KB)
                              </Typography>
                            )}
                </Grid>
            
                      

            </Grid>

        </form>
    </Box>

    
  )
}
export default NewReimbursemnet;
