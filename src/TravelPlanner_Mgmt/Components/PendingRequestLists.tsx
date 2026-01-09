import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
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

  const { state, dispatch } = useContext(TravelPlannerContext);

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
  const [rejectMessage, setRejectMessage] = useState<string>('');

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
      const response = await fetch(`https://localhost:7221/api/TravelRequests/travelrequest/${numericHrId}/pending`);
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Fetch failed: ${response.status} ${response.statusText} - ${text}`);
        setRowData([]);
        return;
      }
      const data = await response.json();
      const normalized: TravelRequestList =
        Array.isArray(data) ? data : Array.isArray(data?.item) ? data.item : data ? [data] : [];
      setRowData(normalized);
    } catch (error) {
      console.error("Error fetching pending requests for HR ID:", error);
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

  const handleApprove = (requestId: number, approvedOn: Date, request_status: string) => {
    dispatch({
      type: TravelPlannerActionType.APPROVE_TRAVEL_REQUEST,
      payload: { requestId, approvedOn, request_status: "Approved" }
    });
    setApproved(true);
    try {
      fetch(`https://localhost:7221/api/TravelRequests/travelrequests/${requestId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_status: "Approved",
          RequestApprovedOn: approvedOn,
          request_id: requestId
        }),
      });
      const handleApprove = async (requestId: number, approvedOn: Date, request_status: string) => {
        dispatch({
          type: TravelPlannerActionType.APPROVE_TRAVEL_REQUEST,
          payload: { requestId, approvedOn, request_status: "Approved" }
        });
        setApproved(true);
        try {
          const response = await fetch(`https://localhost:7221/api/TravelRequests/travelrequests/${requestId}/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request_status: "Approved", RequestApprovedOn: approvedOn, request_id: requestId }),
          });

          if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error(`Approve failed: ${response.status} ${response.statusText} - ${text}`);

          }
          navigate(`/travelplannerdetail/${requestId}`);
        } catch (error) {
          console.error("Error approving request:", error);
        }
      };
    } catch (error) {
      console.error("Error approving request:", error);
    }
    navigate(`/travelplannerdetail/${requestId}`);
  };



  const openConfirmDialog = (request_id: number) => {
    setSelectedId(request_id);
    setConfirmOpen(true);
  };

  const confirmReject = async () => {
    if (selectedId == null) {
      setConfirmOpen(false);
      return;
    };
    try {
      await fetch(`https://localhost:7221/api/TravelRequests/travelrequests/${selectedId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request_status: "Rejected" }),
      });

      dispatch({
        type: TravelPlannerActionType.REJECT_TRAVEL_REQUEST,
        payload: { requestId: selectedId, request_status: 'Rejected' },
      });
      setRowData(prev =>
        prev.map(r => r.request_id === selectedId ? { ...r, request_status: 'Rejected' } : r)
      );
      setRejectMessage(`Request ID ${selectedId} has been rejected.`);
      setRejected(true);

    }
    catch (error) {
      console.error("Error rejecting request:", error);
    }
    setConfirmOpen(false);
    setSelectedId(null);
  }
  const cancelReject = () => {
    setConfirmOpen(false);
    navigate(0);
  }
  const handleReject = (requestId: number) => {
    openConfirmDialog(requestId);

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
      <Paper elevation={3} sx={{ width: "50%", margin: "auto", padding: "10px", marginBottom: "20px", marginTop: "20px" }}>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSearchHRSubmit}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Enter HR ID"
            value={hrIdInput}
            onChange={handleHrInputChange}
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ width: "70%", margin: "auto", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="pending request list table">
            <TableHead >
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id} sx={{ fontWeight: "bold" }}>{col.label}</TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold" }}> Action </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(rowData) && rowData.length > 0 ? (
                rowData.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage).map((row) => (
                <TableRow hover key={row.request_id}>
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
                  <TableCell className='action-btn'>
                    <span style={{ color: "green", cursor: "pointer", marginRight: "1px", padding: 0 }}>
                      <Button variant="contained" size="small"
                        onClick={() => {
                          { handleApprove(row.request_id, new Date(), "Approved") }
                        }}>
                        Approve
                      </Button>
                    </span>
                  </TableCell>
                  <TableCell className='action-btn'>
                    <span style={{ color: "red", cursor: "pointer", marginRight: "1px", padding: 0 }}>
                      <Button variant="contained" size="small"
                        onClick={() => {
                          { handleReject(row.request_id) }
                        }}>
                        Reject
                      </Button>
                    </span>
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
        count={rowData != null ? rowData.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      </Paper>
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
        message={rejectMessage || modalMessages.RequestStatus.Reject.message}
        color={modalMessages.RequestStatus.Reject.color}
      />
      <Button onClick={() => navigate('/')}>HOME</Button>
    </>
  );
};

export default PendingRequestList;