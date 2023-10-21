import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { Room } from "../../models/RoomModel";
import NewReservation from "../Reservation/NewReservation";
import UpdateRoom from "./UpdateRoom";

interface RoomDetailProps extends Room {
  onDelete: () => void;
  onUpdate: () => void;
  updateRoomList: () => void;
}

export const RoomDetail: React.FC<RoomDetailProps> = ({
  _id,
  roomNumber,
  roomType,
  roomImgUrl,
  roomDescription,
  roomBasePrice,
  roomTax,
  roomActive,
  hotelName,
  onDelete,
  onUpdate,
  updateRoomList,
}) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [newReservationModal, setNewReservationModal] = useState(false);

  const history = useHistory();
  const handleBookRoomClick = () => {
    localStorage.setItem("selectedRoom", JSON.stringify({ _id, roomNumber }));
    history.push("/reservations");
  };

  return (
    <div className="col-lg-12 mb-4">
      <div className="card shadow d-flex flex-row">
        <div className="col-md-4 image-container">
          <img
            src={roomImgUrl}
            className="img-fluid w-100 h-100"
            alt={roomDescription}
          />
        </div>
        <div className="card-body col-md-8">
          <h5 className="card-title">{roomType}</h5>
          <div className="row">
            <div className="col-8">
              <p> Room Number: {roomNumber} </p>
              <p> Description: {roomDescription} </p>
              <p> Base Price: {roomBasePrice}</p>
              <p> Tax Price: {roomTax}</p>
              <p> Room in Hotel: {hotelName} </p>
            </div>
            <div className="col-4">
              {isAuthenticated ? (
                <>
                  <div className="row mb-2">
                    <div>
                      {roomActive ? (
                        <button
                          id="bookNow"
                          className="btn btn-success w-100"
                          onClick={handleBookRoomClick}
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
                    <div className="col-12 mb-2">
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
                        <UpdateRoom
                          onShow={showModal}
                          roomId={_id}
                          updateRoomList={updateRoomList}
                          onClose={() => {
                            setShowModal(false);
                          }}
                        />
                      )}
                    </div>
                    <div className="col-12">
                      <button
                        className="btn btn-danger w-100"
                        onClick={onDelete}
                      >
                        <FontAwesomeIcon icon={faTrash} className="me-1" />{" "}
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row mb-2">
                    <div>
                      {roomActive ? (
                        <button
                          id="bookNow"
                          className="btn btn-success w-100"
                          onClick={handleBookRoomClick}
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

          {newReservationModal && (
            <NewReservation
              showNewReservationModal={newReservationModal}
              closeNewReservationModal={() => setNewReservationModal(false)}
              updateReservationList={onUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};
