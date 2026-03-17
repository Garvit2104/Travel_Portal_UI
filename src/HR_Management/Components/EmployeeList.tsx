import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import UserDetailsJson from "../Resources/UserDetails.json";
import { EmployeeContext } from "../Context/EmployeeContext";
import modalMessages from "../Resources/HR_Resource.json";
import CustomModal from "../../Common/Modals";
import { useNavigate } from "react-router-dom";
import { Employee, EmployeeList } from "../HR_States/EmployeeStates";
import { EmployeeService } from "../HR_Service/HRServices";
import { EmployeeActionType } from "../HR_Actions/EmployeeReducer";
import "./EmployeeLists.css";
import Loader from "../../Common/Loader";

type Column = {
  Id: string;
  label: string;
  type?: string;
};

const UserListComponent: React.FC = () => {
  const navigate = useNavigate();

  const { dispatch } = useContext(EmployeeContext);

  const [rows, setRows] = useState<EmployeeList>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const columns: Column[] = UserDetailsJson.UserDetails.fields;

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const data = await EmployeeService.fetchEmployees();
        setRows(data);
      } catch (error) {
        console.error("Error fetching user list:", error);
        setErrorOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (employee_id: number) => {
    try {
      await EmployeeService.deleteEmployee(employee_id);

      setRows((prev) => prev.filter((row) => row.employee_id !== employee_id));
      dispatch({type : EmployeeActionType.REMOVE_EMPLOYEE, payload: employee_id})
      setDeleteOpen(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setErrorOpen(true);
    }
  };

  const openConfirmDialog = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId !== null) {
      handleDelete(selectedId);
    }
    setConfirmOpen(false);
  };

  const handleUpdate = (data: Employee) => {
    navigate(`/add-user/${data.employee_id}`, { state: data });
  };
  const emptyRows =
  page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - rows.length)
    : 0;
  if (loading) {
    return <Loader />;
  }

  return (
    <>
    <Box sx={{ 
    p: 3, 
    display: "flex",
    flexDirection: "column",
    alignItems: "center",    
    justifyContent: "flex-start"  
    }}>
       <Typography 
      variant="h6" 
      sx={{ 
        fontWeight: 600, 
        color: "#1a2a3a",
        textAlign: "center",     
        mb: 2,                  
        width: "100%",           
      }}
    >
      Employee List
    </Typography>
    
      <Paper elevation = {2} sx={{ width: "90%", maxWidth: 900,  borderRadius: 3, margin: "auto", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="user list table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.Id} sx={{ fontWeight: 700, fontSize: "0.85rem", letterSpacing: 0.4 }}>
                    {col.label}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 700, fontSize: "0.85rem", letterSpacing: 0.4 }}> 
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow hover key={row.employee_id} sx={{
                        // FIX 11: Added alternating row stripes for readability
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f7f9fb",
                        "&:hover": { backgroundColor: "#eef2f7" },
                      }}>
                    {columns.map((col) => (
                      <TableCell key={col.Id} sx={{ fontWeight: "normal", fontSize: "0.85rem"}}>
                        {row[col.Id as keyof Employee] || ""}
                      </TableCell>
                    ))}
                    <TableCell className="action-btn"
                    sx = {{ whiteSpace: "nowrap"}}
                    >
                      <span
                        style={{
                          color: "#d21a1afc",
                          cursor: "pointer",
                          marginRight: "1px",
                          padding: 0,
                        }}
                        
                        onClick={() =>
                          handleUpdate({
                            employee_id: row.employee_id,
                            first_name: row.first_name,
                            last_name: row.last_name,
                            phone_number: row.phone_number,
                            email_address: row.email_address,
                            current_grade_id: row.current_grade_id,
                            role: row.role,
                          })
                        }
                      >
                        <EditIcon />
                      </span>
                      <span
                        style={{ color: "#d21a1afc", cursor: "pointer" }}
                        onClick={() => openConfirmDialog(row.employee_id)}
                      >
                        {" "}
                        <DeleteIcon />
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={columns.length + 1} />
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={rows != null ? rows.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
        </Paper>
        </Box>
        

        <Dialog open={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        PaperProps = {{sx : {borderRadius: 3}}}
        >
          <DialogTitle sx = {{fontWeight: 600}}>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this employee?
          </DialogContent >
          <DialogActions sx = {{pb: 2, px:3}}> 
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <CustomModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          title={modalMessages.AddEmployee.delete.title}
          message={modalMessages.AddEmployee.delete.message}
          errorMessage={modalMessages.AddEmployee.delete.errorMessage}
          color={modalMessages.AddEmployee.delete.color}
        />
      
      <CustomModal
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title={modalMessages.AddEmployee.error.title}
        message={modalMessages.AddEmployee.error.message}
        color={modalMessages.AddEmployee.error.color}
      />
    </>
  );
};

export default UserListComponent;
