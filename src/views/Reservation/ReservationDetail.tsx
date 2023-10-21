import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Reservation } from "../../models/ReservationModel";
import UpdateReservation from "./UpdateReservation";

interface ReservationDetailProps extends Reservation {
  onDelete: () => void;
  onUpdate: () => void;
  updateReservationList: () => void;
}

export const ReservationDetail: React.FC<ReservationDetailProps> = ({
  _id,
  reservationNumber,
  nameGuest,
  lastNameGuest,
  documentType,
  idNumberGuest,
  genderGuest,
  emailGuest,
  phoneGuest,
  emergencyContactName,
  emergencyContactPhone,
  checkIn,
  checkOut,
  lodgingCity,
  hotelNameReservation,
  roomNumberReservation,
  reservationActive,
  guests,
  onDelete,
  onUpdate,
  updateReservationList,
}) => {
  const [showModalUpdateReservation, setShowModalUpdateReservation] =
    useState(false);

  return (
    <div className="col-lg-12 mb-4">
      <div className="card shadow d-flex flex-row">
        <div className="card-body col-md-8">
          <h5 className="card-title">
            Reservation Number: {reservationNumber}
          </h5>
          <div className="row">
            <div className="col-9">
              <div className="row">
                <div className="col">
                  <p> Guest Name: {nameGuest} </p>
                  <p> Last Name: {lastNameGuest} </p>
                  <p> ID Card: {documentType} </p>
                  <p> ID Number: {idNumberGuest} </p>
                  <p> Gender: {genderGuest} </p>
                  <p> Email: {emailGuest} </p>
                  <p> Phone: {phoneGuest} </p>
                  <p> Emergency Contact Name: {emergencyContactName} </p>
                  <p> Emergency Contact Phone: {emergencyContactPhone} </p>
                </div>
                <div className="col">
                  <p>
                    {" "}
                    Check In:{" "}
                    {checkIn
                      ? new Date(checkIn).toLocaleDateString()
                      : "N/A"}{" "}
                  </p>
                  <p>
                    {" "}
                    Check Out:{" "}
                    {checkOut
                      ? new Date(checkOut).toLocaleDateString()
                      : "N/A"}{" "}
                  </p>
                  <p> Hotel Name Reservation: {hotelNameReservation}</p>
                  <p> Lodging City: {lodgingCity} </p>
                  <p> Room Number Reservation: {roomNumberReservation} </p>
                  {guests.length === 1 ? (
                    <p> Additional Guest: {guests[0]}</p>
                  ) : (
                    <p>
                      Additional Guests: {guests.slice(0, -1).join(", ")}{" "}
                      {guests.length > 1 && (
                        <span>&#38; {guests[guests.length - 1]}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="row mb-2">
                <div>
                  {reservationActive ? (
                    <button className="btn btn-success w-100">Actived</button>
                  ) : (
                    <button className="btn btn-secondary w-100" disabled>
                      Cancelled
                    </button>
                  )}
                </div>
              </div>
              <div className="row mb-2">
                <div className="col">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => {
                      onUpdate();
                      setShowModalUpdateReservation(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </button>
                  {showModalUpdateReservation && (
                    <UpdateReservation
                      showUpdateReservationModal={showModalUpdateReservation}
                      reservationId={_id}
                      updateReservationList={updateReservationList}
                      closeUpdateReservationModal={() =>
                        setShowModalUpdateReservation(false)
                      }
                    />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <button className="btn btn-danger w-100" onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
