export interface ReservationTypes {
  type_id: number;
  type_name: string;
}

export interface ReservationDocs {
  id: number;
  reservation_id: number;
  document_url: string;
}

export interface Reservation {
  id?: number;
  reservation_done_by_employee_id: number;
  travel_request_id: number;
  reservation_type_id: number;
  reservation_done_with_entity: string;
  reservation_date: string;
  amount: number;
  // confirmationId: string;
  remarks: string;
  created_on?: string;
  documents?: ReservationDocs[];
}

export interface ReservationState {
  reservationTypes: ReservationTypes[];
  reservations: Reservation[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  selectedReservation: Reservation | null; // for details page
}

export const initialReservationState: ReservationState = {
  reservationTypes: [],
  reservations: [],
  loading: false,
  error: null,
  successMessage: null,
  selectedReservation: null

};