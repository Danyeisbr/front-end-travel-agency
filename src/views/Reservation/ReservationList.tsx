import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Reservation } from "../../models/ReservationModel";
import {
  getReservationsController,
  deleteReservationController,
} from "../../controllers/ReservationController";
import { ReservationDetail } from "./ReservationDetail";
import NewReservation from "./NewReservation";

const ReservationList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [newReservationModal, setNewReservationModal] = useState(true);

  const updateReservationList = async () => {
    const fetchedReservations = await getReservationsController();
    setReservations(fetchedReservations);
  };

  const handleUpdateReservation = (reservationId: string) => {
    // Pass the updateReservationList function to the UpdateReservation and NewReservation component to update the Reservations list after creating or modifying a Reservation
    return () => updateReservationList();
  };

  const handleDeleteReservation = async (
    reservationId: string
  ): Promise<void> => {
    try {
      await deleteReservationController(reservationId);
      // Updates the Reservations list after deleting one
      setReservations((prevReservations) =>
        prevReservations.filter(
          (reservation) => reservation._id !== reservationId
        )
      );
      console.log("Reservation deleted successfully");
    } catch (error) {
      console.error("Error deleting Reservation:", error);
    }
  };

  const fetchReservationsData = async () => {
    const fetchedReservations = await getReservationsController();
    // Convert date strings to Date objects
    fetchedReservations.forEach((reservation) => {
      reservation.checkIn = new Date(reservation.checkIn);
      reservation.checkOut = new Date(reservation.checkOut);
    });
    return fetchedReservations;
  };

  useEffect(() => {
    const loadReservations = async () => {
      setLoading(true); // Reservations data loading from server
      try {
        const fetchedReservations = await fetchReservationsData();
        setReservations(fetchedReservations);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false); // Loading is done
      }
    };

    loadReservations();
  }, []);

  return (
    <>
      <section>
        <div className="container shadow pt-5 pb-4 mb-3 bg-white h-100">
          {isAuthenticated ? (
            <>
              <div className="row loading-container mb-3 p-4">
                {loading && (
                  <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                <h1 className="mb-3">Reservations List</h1>

                {reservations.map((reservation) => (
                  <ReservationDetail
                    key={reservation._id}
                    {...reservation}
                    onDelete={() =>
                      reservation._id &&
                      handleDeleteReservation(reservation._id)
                    }
                    onUpdate={() =>
                      reservation._id &&
                      handleUpdateReservation(reservation._id)
                    }
                    updateReservationList={updateReservationList}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <h1 className="mb-3 text-center">
                  {" "}
                  Your reservations, so far...
                </h1>
              </div>
            </>
          )}
          {newReservationModal && (
            <NewReservation
              updateReservationList={updateReservationList}
              showNewReservationModal={newReservationModal}
              closeNewReservationModal={() => setNewReservationModal(false)}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default ReservationList;
