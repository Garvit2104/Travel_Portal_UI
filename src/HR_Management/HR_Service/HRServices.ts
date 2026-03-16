import { Employee, EmployeeList } from "../HR_States/EmployeeStates";

export type Grade = { id: number; name: string };



export const BASE_URL = "http://localhost:5000/api/HR_Services";

export const EmployeeService = {
  async fetchEmployees(): Promise<Employee[]> {
    const res = await fetch(`${BASE_URL}/employees`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },


  async fetchEmployeeById(employeeId: number): Promise<Employee> {
    if (!employeeId || employeeId <= 0) throw new Error("employeeId required");
    const res = await fetch(`${BASE_URL}/employees/${employeeId}`); // FIX: correct endpoint
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return res.json();
  },


  async addEmployee(employee: Employee): Promise<number> {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    // Return status; DO NOT parse JSON blindly
    return res.status; // often 201 or 204
  },

  async updateEmployee(employee: Employee): Promise<number> {
    if (!employee.employee_id) throw new Error("employee_id required");
    const res = await fetch(`${BASE_URL}/employees/${employee.employee_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return res.status; // 200/204
  },

  async deleteEmployee(employeeId: number): Promise<number> {
    const res = await fetch(`${BASE_URL}/employees/${employeeId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    return res.status; // 200/204
  },
};

export const GradeService = {
  async fetchGrades(): Promise<Grade[]> {
    const res = await fetch(`${BASE_URL}/grades`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};
