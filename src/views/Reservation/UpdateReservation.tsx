import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Reservation } from "../../models/ReservationModel";
import {
  getReservationByIdController,
  updateReservationController,
} from "../../controllers/ReservationController";
import "../../assets/styles/main.css";

interface UpdateReservationProps {
  showUpdateReservationModal: boolean;
  closeUpdateReservationModal: () => void;
  reservationId?: string;
  updateReservationList: () => void;
}

const UpdateReservation: React.FC<UpdateReservationProps> = ({
  showUpdateReservationModal,
  closeUpdateReservationModal,
  reservationId,
  updateReservationList,
}) => {
  const [additionalGuestNames, setAdditionalGuestNames] = useState<string[]>(
    []
  );
  const [reservationData, setReservationData] = useState<Reservation>({
    nameGuest: "",
    lastNameGuest: "",
    documentType: "",
    idNumberGuest: "",
    genderGuest: "",
    emailGuest: "",
    phoneGuest: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    checkIn: new Date(),
    checkOut: new Date(),
    lodgingCity: "",
    hotelNameReservation: "",
    roomNumberReservation: "",
    reservationActive: true,
    guests: [],
    totalPriceReservation: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;
    setReservationData((prevState) => ({
      ...prevState,
      [id]: id === "reservationActive" ? value === "1" : value,
      genderGuest: id === "genderGuest" ? value : prevState.genderGuest,
      documentType: id === "documentType" ? value : prevState.documentType,
    }));
  };

  const handleCheckInChange = (date: Date | null): void => {
    if (date !== null) {
      setReservationData((prevData) => ({
        ...prevData,
        checkIn: date,
      }));
    }
  };

  const handleCheckOutChange = (date: Date | null): void => {
    if (date !== null) {
      setReservationData((prevData) => ({
        ...prevData,
        checkOut: date,
      }));
    }
  };

  const handleGuestsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedValue = parseInt(e.target.value, 10);
    const newGuestNames = Array.from({ length: selectedValue }, () => "");
    console.log(newGuestNames);
    setAdditionalGuestNames(newGuestNames);
  };

  const handleAdditionalGuestNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { value } = e.target;
    setAdditionalGuestNames((prevNames) => {
      const updatedNames = [...prevNames];
      updatedNames[index] = value;
      console.log(updatedNames);
      return updatedNames;
    });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (reservationId !== undefined) {
        const reservationWithGuests = {
          ...reservationData,
          guests: additionalGuestNames,
        };

        const updatedReservation = await updateReservationController(
          reservationId,
          reservationWithGuests
        );
        // Handles the server response after the update.
        console.log("Reservation updated successfully:", updatedReservation);
        updateReservationList(); // Call the function to update the Reservations list
        closeUpdateReservationModal(); // Close the modal after successful update.
      }
    } catch (error) {
      // Handle update request error.
      console.error("Error updating Reservation:", error);
    }
  };

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        if (reservationId !== undefined) {
          const response = await getReservationByIdController(reservationId);
          console.log(response);
          // Create Date objects with server date values
          const checkInDate = new Date(response.checkIn);
          const checkOutDate = new Date(response.checkOut);

          setReservationData({
            ...response,
            checkIn: checkInDate,
            checkOut: checkOutDate,
          });
          // Set the status of additional guest names
          const additionalGuestNames = response.guests
            ? [...response.guests]
            : [];
          setAdditionalGuestNames(additionalGuestNames);
        }
      } catch (error) {
        console.error("Error fetching Reservation data:", error);
      }
    };

    if (showUpdateReservationModal) {
      fetchReservationData();
    }
  }, [showUpdateReservationModal, reservationId]);

  return (
    <>
      {showUpdateReservationModal && (
        <div className="modal d-flex align-items-center justify-content-center custom-modal">
          <div className="modal-dialog modal-dialog-centered modal-lg w-75 modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary">
                <h5 className="modal-title text-white">Update Reservation</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeUpdateReservationModal}
                ></button>
              </div>
              <div className="modal-body">
                <form className="px-4" onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label">Hotel's Name:</label>
                      <input
                        type="text"
                        className="form-control bg-custom"
                        value={reservationData.hotelNameReservation}
                        required
                        readOnly
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label"> City: </label>
                      <input
                        type="text"
                        className="form-control bg-custom"
                        value={reservationData.lodgingCity}
                        required
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <label className="form-label ">Room:</label>
                      <input
                        type="text"
                        className="form-control bg-custom"
                        value={reservationData.roomNumberReservation}
                        required
                        readOnly
                      />
                    </div>
                    <div className="col-3">
                      <label className="form-label">Check-in</label>
                      <DatePicker
                        selected={reservationData.checkIn}
                        onChange={(date: Date | null) =>
                          handleCheckInChange(date)
                        }
                        className="form-control"
                        id="checkIn"
                        required
                      />
                    </div>
                    <div className="col-3">
                      <label className="form-label">Check-out</label>
                      <DatePicker
                        selected={reservationData.checkOut}
                        onChange={(date: Date | null) =>
                          handleCheckOutChange(date)
                        }
                        className="form-control"
                        id="checkOut"
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="nameGuest" className="py-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nameGuest"
                        placeholder="Your Name"
                        value={reservationData.nameGuest}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="lastNameGuest" className="py-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastNameGuest"
                        placeholder="Your Last Name"
                        value={reservationData.lastNameGuest}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="documentType" className="py-2">
                        Document Type
                      </label>

                      <select
                        className="form-select"
                        id="documentType"
                        name="documentType"
                        value={reservationData.documentType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="National ID Card">
                          National ID Card
                        </option>
                        <option value="Foreigner ID Card">
                          Foreigner ID Card
                        </option>
                        <option value="Resident ID Card">
                          Resident ID Card
                        </option>
                        <option value="Passport"> Passport </option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label htmlFor="idNumberGuest" className="py-2">
                        ID Card
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="idNumberGuest"
                        placeholder="Your ID"
                        value={reservationData.idNumberGuest}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <label className="py-2">Keep Active? </label>
                      <select
                        className="form-select"
                        id="reservationActive"
                        name="reservationActive"
                        value={reservationData.reservationActive ? "1" : "2"}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="py-2"> Gender </label>
                      <select
                        className="form-select"
                        id="genderGuest"
                        name="genderGuest"
                        value={reservationData.genderGuest}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
                      <label className="py-2">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="emailGuest"
                        value={reservationData.emailGuest}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="py-2">Phone Number</label>
                      <input
                        type="number"
                        className="form-control"
                        id="phoneGuest"
                        value={reservationData.phoneGuest}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="emergencyContactName" className="py-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="emergencyContactName"
                        placeholder="Contact's Name"
                        value={reservationData.emergencyContactName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="emergencyContactPhone" className="py-2">
                        Emergency Contact's Phone
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="emergencyContactPhone"
                        placeholder="Your Phone's Contact"
                        value={reservationData.emergencyContactPhone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <label htmlFor="nameGuest" className="py-2">
                        Add Guests
                      </label>
                      <select
                        className="form-select"
                        onChange={handleGuestsChange}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label htmlFor="totalPriceReservation" className="py-2">
                        Total Price Reservation
                      </label>
                      <input
                        type="text"
                        id="totalPriceReservation"
                        className="form-control"
                        value={reservationData.totalPriceReservation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    {additionalGuestNames.map((guestName, index) => (
                      <div className="col-6 mb-3" key={index}>
                        <label htmlFor={`guestName-${index}`} className="py-2">
                          Guest {index + 1} Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`guestName-${index}`}
                          placeholder={`Guest ${index + 1} Name`}
                          value={guestName}
                          onChange={(e) =>
                            handleAdditionalGuestNameChange(e, index)
                          }
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary mb-3 w-100"
                      >
                        Update Reservation
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateReservation;
