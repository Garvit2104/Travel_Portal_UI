export interface ReimbursementTypes{
    id: number;
    name: string;
}

export interface ReimbursementRequests {
    id?: number;
    travel_request_id: number;
    request_raised_by_employee_id: number;
    request_date: Date;
    reimbursement_type_id: number;
    invoice_no: string;
    invoice_date: Date;
    invoice_amount: number;
    document_url: string;
    request_processed_on?: Date;
    request_processed_by_employee_id?: number;
    status: string;
    remarks: string;

}

export interface ReimbursementState {
    reimbursementTypes: ReimbursementTypes[];
    reimbursementRequests: ReimbursementRequests[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    
}

export const initialReimbursementState: ReimbursementState = {
    reimbursementTypes: [],
    reimbursementRequests: [],
    loading: false,
    error: null,
    successMessage: null,
}