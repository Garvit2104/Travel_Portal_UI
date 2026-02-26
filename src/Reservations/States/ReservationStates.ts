export interface ReservationTypes {
  typeId: number;
  typeName: string;
}

export interface ReservationDocs {
  id: number;
  reservationId: number;
  documentURL: string;
}


export interface Reservation {
  id?: number;
  reservationDoneByEmployeeId: number;
  travelRequestId: number;
  reservationTypeId: number;
  reservationDoneWithEntity: string;
  reservationDate: string;
  amount: number;
  confirmationId: string;
  remarks: string;
  createdOn?: string;
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