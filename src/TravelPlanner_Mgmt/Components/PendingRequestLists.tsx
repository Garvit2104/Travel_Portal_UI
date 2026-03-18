import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState, useContext } from 'react';
import { TravelRequest, TravelRequestList } from '../TP_States/TravelPlannerStates';
import Loader from "../../Common/Loader";
import { TravelPlannerContext } from '../Context/TravelPlannerContext';
import NewListJson from '../Resources/PendingRequestList.json';
import dayjs, { Dayjs } from 'dayjs';
import { TravelPlannerActionType } from '../Actions/TravelPlannerReducer';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../../Common/Modals';
import modalMessages from '../Resources/RequestStatus.json';

type Column = {
  id: string;
  label: string;
  type?: string;
  sorting: boolean;
}
const PendingRequestList = () => {

  const {  dispatch } = useContext(TravelPlannerContext);

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [rowData, setRowData] = useState<TravelRequestList>([]);
  const [hrIdInput, setHrIdInput] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  
  const handleHrInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHrIdInput(event.target.value);
  }
  const handleSearchHRSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericHrId = Number(hrIdInput);
    if (!numericHrId || isNaN(numericHrId) || numericHrId <= 0) {
      alert("Please enter a valid HR ID");
      setRowData([]);
      return;
    }
    setLoader(true);
    try {
      const response = await fetch(`http://localhost:5000/api/TP_Services/travelrequests/${numericHrId}/pending`);
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(`Fetch failed: ${response.status} - ${text}`);
        setRowData([]);
        return;
      }
      const data = await response.json();
      const normalized: TravelRequestList =
        Array.isArray(data) ? data : Array.isArray(data?.item) ? data.item : data ? [data] : [];
      setRowData(normalized);
    } catch (error) {
      console.error("Error fetching pending requests for HR ID:", error);
      setRowData([]);
    } finally {
      setLoader(false);
    }
  }

  const columns: Column[] = NewListJson.NewListHeadColumns.fields;

  const formatDate = (value: any) => {
    if (!value) return '';
    const d = dayjs(value);
    return d.isValid() ? d.format('DD-MMM-YYYY') : '';
  };

  const handleApprove = async (requestId: number) => {
    const approvedOn = new Date();
        try {
          const response = await fetch(`http://localhost:5000/api/TP_Services/travelrequests/${requestId}/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              request_status: "Approved", RequestApprovedOn: 
              approvedOn, 
              request_id: requestId 
            }),
          }
        );
          if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error(`Approve failed: ${response.status} ${response.statusText} - ${text}`);
            return;
          }
          dispatch({
        type: TravelPlannerActionType.APPROVE_TRAVEL_REQUEST,
        payload: { requestId, approvedOn, request_status: "Approved" }
      });
      setApproved(true);
          navigate(`/travelplannerdetail/${requestId}`);
        } catch (error) {
          console.error("Error approving request:", error);
        }
    };
  
  const openConfirmDialog = (request_id: number) => {
    setSelectedId(request_id);
    setConfirmOpen(true);
  };

  const handleReject = (requestId: number) => {
    openConfirmDialog(requestId);
  };

  const confirmReject = async () => {
    if (selectedId == null) {
      setConfirmOpen(false);
      return;
    };
    try {
      const response = await fetch(`http://localhost:5000/api/TP_Services/travelrequests/${selectedId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_status: "Rejected" }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        console.error(`Reject failed: ${response.status} - ${text}`);
        setConfirmOpen(false);
        return;
      }

      dispatch({
        type: TravelPlannerActionType.REJECT_TRAVEL_REQUEST,
        payload: { requestId: selectedId, request_status: 'Rejected' },
      });
      setRowData(prev =>
        prev.map(r => r.request_id === selectedId ? { ...r, request_status: 'Rejected' } : r)
      );

      setRejected(true);

    }
    catch (error) {
      console.error("Error rejecting request:", error);
    }
    finally{
      setConfirmOpen(false);
      setSelectedId(null);

    }
  }
  const cancelReject = () => {
    setConfirmOpen(false);
   
  }
  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <>
    <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pt: 4,
        px: 2,
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a2a3a", mb: 2 }}>
          Pending Travel Requests
        </Typography>
      <Paper
          elevation={2}
          component="form"
          noValidate
          onSubmit={handleSearchHRSubmit}
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '40%',
            mb: 3,
            borderRadius: 3,
            px: 1,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter HR ID to load pending requests"
            value={hrIdInput}
            onChange={handleHrInputChange}
            inputProps={{ 'aria-label': 'search by HR ID' }}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>


      <Paper elevation={3} sx={{ width: "90%", maxWidth: 1100, borderRadius:3,  overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="pending request list table">
            <TableHead >
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ fontWeight: "bold" }}>
                    {col.label}
                    </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold" }}> 
                  Action 
                  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(rowData) && rowData.length > 0 ? (
                rowData.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover key={row.request_id} sx={{
                          backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7f9fb",
                          "&:hover": { backgroundColor: "#eef2f7" },
                        }}
                >
                  {columns.map((col) => {
                    const raw = row[col.id as keyof TravelRequest];
                    const value = col.type === 'date' || raw instanceof Date ?
                      formatDate(raw) : String(raw ?? '');
                    return (
                      <TableCell key={col.id as string | number} sx={{ fontWeight: "normal" }}>
                        {value}
                      </TableCell>
                    )
                  }
                  )}
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                          <Button
                            variant="contained"
                            size="small"
                            // Disable if already actioned — prevents double approve/reject
                            disabled={row.request_status !== 'New'}
                            onClick={() => handleApprove(row.request_id)}
                            sx={{
                              mr: 1,
                              backgroundColor: "#2e7d32",
                              "&:hover": { backgroundColor: "#1b5e20" },
                              textTransform: "none",
                              fontSize: "0.78rem",
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={row.request_status !== 'New'}
                            onClick={() => handleReject(row.request_id)}
                            sx={{
                              backgroundColor: "#c0392b",
                              "&:hover": { backgroundColor: "#922b21" },
                              textTransform: "none",
                              fontSize: "0.78rem",
                            }}
                          >
                            Reject
                          </Button>
                        </TableCell>
                </TableRow>
              ))
            ): (
              <TableRow>
                <TableCell colSpan={columns.length + 1} sx={{ textAlign: 'center', py: 4 }}>
                  {loader ? 'Loading…' : 'No pending requests found. Enter an HR ID and search.'}
                </TableCell>
              </TableRow>
            )}

            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        component="div"
        count={rowData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      </Paper>
      </Box>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Reject</DialogTitle>
        <DialogContent>Are you sure you want to Reject the travel Request?</DialogContent>
        <DialogActions>
          <Button onClick={cancelReject}>Cancel</Button>
          <Button color="error" onClick={confirmReject}>Reject</Button>
        </DialogActions>
      </Dialog>

      <CustomModal
        open={approved}
        onClose={() => setApproved(false)}
        title={modalMessages.RequestStatus.Approve.title}
        message={modalMessages.RequestStatus.Approve.message}
        color={modalMessages.RequestStatus.Approve.color}
      />
      <CustomModal
        open={rejected}
        onClose={() => setRejected(false)}
        title={modalMessages.RequestStatus.Reject.title}
        message={ modalMessages.RequestStatus.Reject.message}
        color={modalMessages.RequestStatus.Reject.color}
      />
     
    </>
  );
};

export default PendingRequestList;



