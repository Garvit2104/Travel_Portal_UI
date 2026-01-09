export type Employee = { 
    employee_id: number; 
    first_name: string; 
    last_name: string; 
    phone_number: string; 
    email_address: string; 
    current_grade_id: number; 
    role: string; 
  };

export const EmployeeIniitalState : Employee = {
    employee_id: 0, 
    first_name: "", 
    last_name: "", 
    phone_number: "", 
    email_address: "", 
    current_grade_id: 0, 
    role: "",
}

export type EmployeeList = Employee[];
