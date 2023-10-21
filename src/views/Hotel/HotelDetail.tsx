import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Hotel } from "../../models/HotelModel";
import { useHistory } from "react-router-dom";
import UpdateHotel from "./UpdateHotel";
import "../../assets/styles/hotel-list.css";

interface HotelDetailProps extends Hotel {
  onDelete: () => void;
  onUpdate: () => void;
  updateHotelList: () => void;
}

export const HotelDetail: React.FC<HotelDetailProps> = ({
  _id,
  hotelName,
  hotelAddress,
  hotelCity,
  hotelZipCode,
  hotelImgUrl,
  hotelDescription,
  hotelActive,
  roomNumbers,
  onDelete,
  onUpdate,
  updateHotelList,
}) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const history = useHistory();
  const handleBookHotelClick = () => {
    localStorage.setItem("selectedHotel", JSON.stringify({ _id, hotelName }));
    history.push("/rooms");
  };

  return (
    <div className="col-lg-12 mb-4">
      <div className="card shadow d-flex flex-row">
        <div className="col-md-4 image-container">
          <img
            src={hotelImgUrl}
            className="img-fluid w-100 h-100"
            alt={hotelDescription}
          />
        </div>

        <div className="card-body col-md-8">
          <h5 className="card-title">{hotelName}</h5>
          <div className="row">
            <div className="col-8">
              <p> Address: {hotelAddress} </p>
              <p> City: {hotelCity} </p>
              <p> Zip Code: {hotelZipCode} </p>
              <p> Description: {hotelDescription} </p>
              {roomNumbers.length === 1 ? (
                <p> Available Room: {roomNumbers[0]}</p>
              ) : (
                <p>
                  Available Rooms: {roomNumbers.slice(0, -1).join(", ")}{" "}
                  {roomNumbers.length > 1 && (
                    <span>&#38; {roomNumbers[roomNumbers.length - 1]}</span>
                  )}
                </p>
              )}
            </div>
            <div className="col-4">
              {isAuthenticated ? (
                <>
                  <div className="row mb-2">
                    <div>
                      {hotelActive ? (
                        <button
                          className="btn btn-success w-100"
                          onClick={handleBookHotelClick}
                        >
                          Book Now!
                        </button>
                      ) : (
                        <button className="btn btn-secondary w-100" disabled>
                          No Available
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-12">
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => {
                          onUpdate();
                          setShowModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit
                      </button>
                      {showModal && (
                        <UpdateHotel
                          onShow={showModal}
                          hotelId={_id}
                          updateHotelList={updateHotelList}
                          onClose={() => {
                            setShowModal(false);
                          }}
                        />
                      )}
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-danger w-100 mt-2"
                        onClick={onDelete}
                      >
                        <FontAwesomeIcon icon={faTrash} className="me-1" />Delete
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row mb-2">
                    <div>
                      {hotelActive ? (
                        <button
                          className="btn btn-success w-100"
                          onClick={handleBookHotelClick}
                        >
                          Book Now!
                        </button>
                      ) : (
                        <button className="btn btn-secondary w-100" disabled>
                          No Available
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
