import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Reservation } from "../../models/ReservationModel";
import { createReservationController } from "../../controllers/ReservationController";
import { sendEmailController } from "../../controllers/EmailResend";
import ModalSuccess from "./ModalSuccess";

interface NewReservationProps {
  showNewReservationModal: boolean;
  closeNewReservationModal: () => void;
  updateReservationList: () => void;
}

const NewReservation: React.FC<NewReservationProps> = ({
  showNewReservationModal,
  closeNewReservationModal,
  updateReservationList,
}) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationNumber, setReservationNumber] = useState<
    number | undefined
  >(undefined);

  const [additionalGuestNames, setAdditionalGuestNames] = useState<string[]>(
    []
  );

  const [reservationData, setReservationData] = useState<Reservation>({
    reservationNumber: 1,
    nameGuest: "",
    lastNameGuest: "",
    documentType: "National ID Card",
    idNumberGuest: "",
    genderGuest: "Male",
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
  });

  const [formData, setFormData] = useState({
    hotelCity: "",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    numGuests: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    console.log("Input changed");
    const { id, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleDateChange = (date: Date | null, field: string) => {
    if (date !== null) {
      setReservationData((prevData) => ({
        ...prevData,
        [field]: date,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      setIsSubmitting(true); // Disable submit button
      setLoading(true); // Show loading indicator

      const reservationWithGuests = {
        ...reservationData,
        guests: additionalGuestNames,
      };
      const newReservation = await createReservationController(
        reservationWithGuests
      );
      if (
        newReservation &&
        typeof newReservation.reservationNumber === "number"
      ) {
        setReservationNumber(newReservation.reservationNumber);
        console.log("Sending email...");
        const sendEmail = await sendEmailController({
          reservationData: {
            ...newReservation,
            reservationNumber: newReservation.reservationNumber,
          },
          additionalGuestNames,
        });
        console.log("Email sent...: " + sendEmail);
        setShowSuccessModal(true);
      }
      //console.log("New Reservation created:", newReservation);
      updateReservationList();
    } catch (error) {
      console.error("Error creating Reservation:", error);
    } finally {
      setIsSubmitting(false); // Enable submit button
      setLoading(false); // Hide loading indicator
    }
  };

  const handleGuestsChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selectedValue = parseInt(e.target.value, 10);
    const newGuestNames = Array.from({ length: selectedValue }, () => "");
    setAdditionalGuestNames(newGuestNames);
    setFormData((prevData) => ({
      ...prevData,
      numGuests: selectedValue,
    }));
  };

  const handleAdditionalGuestNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const { value } = e.target;
    setAdditionalGuestNames((prevNames) => {
      const updatedNames = [...prevNames];
      console.log(updatedNames);
      updatedNames[index] = value;
      return updatedNames;
    });
  };

  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    const hotelData = localStorage.getItem("selectedHotel");
    const roomData = localStorage.getItem("selectedRoom");

    // Update the state only if the localStorage data exists to prevent inputs from being empty when the form is rendered
    if (hotelData && roomData && storedFormData) {
      const parsedHotelData = JSON.parse(hotelData);
      const parsedRoomData = JSON.parse(roomData);
      const parsedFormData = JSON.parse(storedFormData);

      // Set default values to state if empty
      setReservationData((prevData) => ({
        ...prevData,
        lodgingCity: parsedFormData.hotelCity,
        checkIn: new Date(parsedFormData.checkInDate),
        checkOut: new Date(parsedFormData.checkOutDate),
        hotelNameReservation: parsedHotelData?.hotelName || "",
        roomNumberReservation: parsedRoomData?.roomNumber || "",
      }));

      const selectedValue = parseInt(parsedFormData.numGuests, 10);
      const newGuestNames = Array.from({ length: selectedValue }, () => "");
      setAdditionalGuestNames(newGuestNames);
    }
  }, []);

  return (
    <>
      {showNewReservationModal && (
        <div className="modal d-flex align-items-center justify-content-center custom-modal">
          <div className="modal-dialog modal-dialog-centered modal-lg w-75 modal-dialog-scrollable">
            <div className="modal-content">
              {showSuccessModal ? (
                <ModalSuccess
                  show={showSuccessModal}
                  onHide={() => setShowSuccessModal(false)}
                  reservationNumber={reservationNumber}
                />
              ) : (
                <>
                  <div className="modal-header bg-primary">
                    <h5 className="modal-title text-white">
                      Create Reservation
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={closeNewReservationModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form className="px-4" onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-6">
                          <label className="form-label">
                            Your Selection's Hotel:
                          </label>
                          <input
                            type="text"
                            id="hotelNameReservation"
                            className="form-control"
                            value={reservationData.hotelNameReservation}
                            required
                            readOnly
                          />
                        </div>
                        <div className="col-6">
                          <label className="form-label">
                            Your Selection's Room:{" "}
                          </label>
                          <input
                            type="text"
                            id="roomNumberReservation"
                            className="form-control"
                            value={reservationData.roomNumberReservation}
                            required
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <label className="form-label">Hotel's Location</label>
                          <input
                            type="text"
                            id="lodgingCity"
                            className="form-control"
                            value={reservationData.lodgingCity}
                            required
                            readOnly
                          />
                        </div>
                        <div className="col-3">
                          <label className="form-label">Check-in</label>
                          <DatePicker
                            selected={reservationData.checkIn}
                            onChange={(date) =>
                              handleDateChange(date, "checkIn")
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
                            onChange={(date) =>
                              handleDateChange(date, "checkOut")
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
                            placeholder="ID Card"
                            value={reservationData.idNumberGuest}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <label className="py-2">Gender</label>
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
                      </div>

                      <div className="row">
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
                        <div className="col-6 mb-3">
                          <label htmlFor="addGuests" className="py-2">
                            Add Guests
                          </label>
                          <select
                            className="form-select"
                            id="addGuests"
                            value={formData.numGuests}
                            onChange={handleGuestsChange}
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                          </select>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-6">
                          <label
                            htmlFor="emergencyContactName"
                            className="py-2"
                          >
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
                        <div className="col-6 mb-3">
                          <label
                            htmlFor="emergencyContactPhone"
                            className="py-2"
                          >
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

                      <div className="row">
                        {/* Render additional inputs */}

                        {additionalGuestNames.map((guestName, index) => (
                          <div className="col-12 mb-3" key={index}>
                            <label
                              htmlFor={`addGuest${index}`}
                              className="py-2"
                            >
                              Guest {index + 1}
                            </label>
                            <input
                              key={index}
                              type="text"
                              className="form-control"
                              id={`addGuest${index}`}
                              placeholder={`Guest ${index + 1} Name`}
                              value={guestName}
                              onChange={(e) =>
                                handleAdditionalGuestNameChange(e, index)
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <div className="row">
                        <div className="col-12">
                          <button
                            disabled={isSubmitting}
                            type="submit"
                            className="btn btn-primary mb-3 w-100"
                          >
                            {isSubmitting && loading ? (
                              <div
                                className="spinner-border text-light"
                                role="status"
                              >
                                <span className="sr-only">Loading...</span>
                              </div>
                            ) : (
                              "Create Reservation"
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewReservation;
