// Contains the reservation control logic (handling requests to the server).
import axios from "../services/databaseService";
import { Reservation } from "../models/ReservationModel";

export const getReservationsController = async (): Promise<Reservation[]> => {
  const response = await axios.get("/reservations");
  return response.data;
};

export const getReservationByIdController = async (id: string): Promise<Reservation> => {
  const response = await axios.get("/reservations/" + id);
  return response.data;
};

export const createReservationController = async (
  newReservation: Reservation
): Promise<Reservation> => {
  const response = await axios.post("/reservations", newReservation);
  return response.data;
};

export const updateReservationController = async (
  reservationId: string,
  updatedReservation: Reservation
): Promise<Reservation> => {
  const response = await axios.put("/reservations/" + reservationId, updatedReservation);
  return response.data;
};

export const deleteReservationController = async (
  reservationId: string
): Promise<Reservation> => {
  const response = await axios.delete("/reservations/" + reservationId);
  return response.data;
};
