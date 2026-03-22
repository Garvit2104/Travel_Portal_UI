import React, { useState } from "react";
import {
  Box, Button, Chip, IconButton, InputBase, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import Loader from "../../Common/Loader";
import dayjs from "dayjs";
import { ReimbursementRequests } from "../States/ReimbursementStates";

const ReimbursementsList: React.FC = () => {
  const navigate = useNavigate();

  const [travelRequestInput, setTravelRequestInput] = useState("");
  const [rows, setRows] = useState<ReimbursementRequests[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loader, setLoader] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleToggleView = (id: number) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(travelRequestInput);
    if (!id || isNaN(id) || id <= 0) {
      alert("Please enter a valid Travel Request ID");
      return;
    }
    setLoader(true);
    setSearched(true);
    try {
      const res = await fetch(`http://localhost:5000/api/Reimbursement/travel-request/${id}`);
      if (!res.ok) { setRows([]); return; }
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
      setPage(0);
      setExpandedRowId(null);
    } catch (err) {
      console.error("Error fetching reimbursements:", err);
      setRows([]);
    } finally {
      setLoader(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "success";
      case "Rejected": return "error";
      default: return "warning";
    }
  };

  if (loader) return <Loader />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", pt: 4, px: 2 }}>

      <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a2a3a", mb: 2 }}>
        Reimbursement Details
      </Typography>

      {/* ── Search Bar ── */}
      <Paper
        elevation={2}
        component="form"
        noValidate
        onSubmit={handleSearch}
        sx={{ display: "flex", alignItems: "center", width: "40%", mb: 3, borderRadius: 3, px: 1 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter Travel Request ID"
          value={travelRequestInput}
          onChange={(e) => setTravelRequestInput(e.target.value)}
          inputProps={{ "aria-label": "search by travel request id" }}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* ── Table ── */}
      <Paper elevation={3} sx={{ width: "90%", maxWidth: 1100, borderRadius: 3, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="reimbursements table">
            <TableHead>
              <TableRow>
                {["ID", "Employee ID", "Type ID",  "Status", "Action"].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.85rem", letterSpacing: 0.4 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length > 0 ? (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isExpanded = expandedRowId === row.id;
                    return (
                      <TableRow
                        hover
                        key={row.id ?? index}
                        sx={{
                          backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7f9fb",
                          "&:hover": { backgroundColor: "#eef2f7" },
                        }}
                      >
                        <TableCell sx={{ fontSize: "0.85rem" }}>{row.id}</TableCell>
                        <TableCell sx={{ fontSize: "0.85rem" }}>{row.request_raised_by_employee_id}</TableCell>
                        <TableCell sx={{ fontSize: "0.85rem" }}>{row.reimbursement_type_id}</TableCell>
            
                        <TableCell>
                          <Chip
                            label={row.status || "Pending"}
                            color={getStatusColor(row.status) as any}
                            size="small"
                            sx={{ fontSize: "0.75rem" }}
                          />
                        </TableCell>

                        {/* ── Action Column ── */}
                        <TableCell sx={{ whiteSpace: "nowrap" }}>

                          {/* Toggle View Icon */}
                          <IconButton
                            size="small"
                            title={isExpanded ? "Hide Amount" : "View Amount"}
                            onClick={() => handleToggleView(row.id!)}
                            sx={{ color: "#1e4d8c", mr: 1 }}
                          >
                            {isExpanded
                              ? <VisibilityOffIcon fontSize="small" />
                              : <VisibilityIcon fontSize="small" />
                            }
                          </IconButton>

                          {/* Process Button */}
                          <Button
                            variant="contained"
                            size="small"
                            disabled={row.status === "Approved" || row.status === "Rejected"}
                            onClick={() => navigate(`/process-reimbursement/${row.id}`)}
                            sx={{
                              backgroundColor: "#1e4d8c",
                              "&:hover": { backgroundColor: "#164080" },
                              textTransform: "none",
                              fontSize: "0.78rem",
                            }}
                          >
                            Process
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                    {searched
                      ? "No reimbursements found for this Travel Request ID."
                      : "Enter a Travel Request ID and search."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Box>
  );
};

export default ReimbursementsList;