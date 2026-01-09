import React, { useState, useEffect, useContext } from "react";
import {
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

  const { state, dispatch } = useContext(EmployeeContext);

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
      const response = await fetch(
        `https://localhost:7260/api/Users/employee/${employee_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        setRows(rows.filter((row) => row.employee_id !== employee_id));
        dispatch({
          type: EmployeeActionType.REMOVE_EMPLOYEE,
          payload: employee_id,
        });
        setDeleteOpen(true);
      }
      setErrorOpen(true);
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

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Paper sx={{ width: "70%", margin: "auto", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="user list table">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.Id} sx={{ fontWeight: "bold" }}>
                    {col.label}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: "bold" }}> Action </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover key={row.employee_id}>
                    {columns.map((col) => (
                      <TableCell key={col.Id} sx={{ fontWeight: "normal" }}>
                        {row[col.Id as keyof Employee] || ""}
                      </TableCell>
                    ))}
                    <TableCell className="action-btn"
                    sx = {{display : "flex", gap: "4px", alignItems: "center"}}
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
          rowsPerPageOptions={[5, 10, 25]}
        />

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this user?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>
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
      </Paper>
      <Button onClick={() => navigate("/")}>HOME</Button>
    </>
  );
};

export default UserListComponent;
