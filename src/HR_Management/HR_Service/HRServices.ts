import { Employee, EmployeeList } from "../HR_States/EmployeeStates";

export type Grade = { id: number; name: string };


// services/employeeService.ts (Minimal)
export const BASE_URL = "https://localhost:7260/api";

export const EmployeeService = {
  async fetchEmployees(): Promise<Employee[]> {
    const res = await fetch(`${BASE_URL}/Users/employee`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // this endpoint returns JSON -> safe
    return res.json();
  },

  async addEmployee(employee: Employee): Promise<number> {
    const res = await fetch(`${BASE_URL}/Users/employee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    // success only if 2xx
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    // Return status; DO NOT parse JSON blindly
    return res.status; // often 201 or 204
  },

  async updateEmployee(employee: Employee): Promise<number> {
    if (!employee.employee_id) throw new Error("employee_id required");
    const res = await fetch(`${BASE_URL}/Users/employee/${employee.employee_id}`, {
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
    const res = await fetch(`${BASE_URL}/Users/employee/${employeeId}`, {
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
    const res = await fetch(`${BASE_URL}/Grades/grades`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};
