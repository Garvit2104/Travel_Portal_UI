import { Reservation, ReservationTypes } from "../States/ReservationStates";

const BASE_URL = "https://localhost:7174/api/reservations";

// ======================================
// GET Reservation Types
// ======================================
export const fetchReservationTypes = async() : Promise<ReservationTypes[]> => {
  try {
    const response = await fetch(`${BASE_URL}/types`)

    if (!response.ok) {
      throw new Error("Unable to fetch reservation types");
    }

    return await response.json();
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

// ======================================
// CREATE Reservation
// ======================================
export const createReservation = async (formData: FormData) : Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/add`, {
      method: "POST",
// FormData is passed directly as the body — no JSON.stringify needed
      body: formData,
// ⚠️ Do NOT add "Content-Type": "application/json" here.
      // The browser will automatically set "multipart/form-data" with boundary.
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.text();
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

// ======================================
// GET Reservations by TravelRequestId
// ======================================
export const fetchReservationsByTravelRequestId = async (travelRequestId: number): Promise<Reservation[]> => {
  try {
    const response = await fetch(`${BASE_URL}/track/${travelRequestId}`);

    if (!response.ok) {
      throw new Error("Unable to fetch reservations");
    }

    return await response.json();
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

// ======================================
// GET Reservation By Id
// ======================================
export const fetchReservationById = async (
  reservationId: number): Promise<Reservation> => {
  try {
    const response = await fetch(`${BASE_URL}/${reservationId}`);

    if (!response.ok) {
      throw new Error("Unable to fetch reservation details");
    }

    return await response.json();
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export const downloadReservationDocument = async (reservationId: number,
  fileName: string = `Reservation_${reservationId}.pdf`): Promise<void> =>{
    try{
        const response = await fetch(`${BASE_URL}/${reservationId}/download`);

    if (!response.ok) {
      throw new Error("Unable to download the reservation document.");
    }
    const blob = await response.blob();
    
    // Create a temporary URL pointing to the blob in memory
    const objectURL = URL.createObjectURL(blob);
// Programmatically create an <a> tag to trigger the browser download
    const link = document.createElement("a");
    link.href = objectURL;
    link.download = fileName; // Sets the filename shown in the browser download
    document.body.appendChild(link);
    link.click(); // Trigger the download

    // Clean up: remove the link and revoke the object URL to free memory
    document.body.removeChild(link);
    URL.revokeObjectURL(objectURL);

    }catch(error: any){
        console.error(error.message);
        throw error;
    }
}