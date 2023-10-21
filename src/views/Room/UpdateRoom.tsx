import React, { useState, useEffect } from "react";
import { Room } from "../../models/RoomModel";
import {
  getRoomByIdController,
  updateRoomController,
} from "../../controllers/RoomController";
import { getHotelsController } from "../../controllers/HotelController";

interface UpdateRoomProps {
  onShow: boolean;
  onClose: () => void;
  roomId?: string;
  updateRoomList: () => void;
}

interface ExtendedRoom extends Room {
  availableHotelNames: string[];
}

const UpdateRoom: React.FC<UpdateRoomProps> = ({
  onShow,
  onClose,
  roomId,
  updateRoomList,
}) => {
  const [roomData, setRoomData] = useState<ExtendedRoom>({
    roomNumber: "",
    roomType: "",
    roomImgUrl: "",
    roomDescription: "",
    roomBasePrice: "",
    roomTax: "",
    roomActive: true,
    hotelName: "", // Fourth Shortlisted Hotel
    availableHotelNames: [], // Other hotels available to add to the room
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        if (roomId !== undefined) {
          const roomResponse = await getRoomByIdController(roomId);
          const availableHotelsResponse = await getHotelsController();

          const availableHotelNames = availableHotelsResponse.map(
            (hotel) => hotel.hotelName
          );

          setRoomData((prevData) => ({
            ...prevData,
            ...roomResponse,
            availableHotelNames,
          }));
        }
      } catch (error) {
        console.error("Error fetching Room data:", error);
      }
    };

    if (onShow) {
      fetchRoomData();
    }
  }, [onShow, roomId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;
    setRoomData((prevState) => ({
      ...prevState,
      [id]: id === "roomActive" ? value === "1" : value,
    }));
  };

  const handleHotelSelectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [id]: id === "hotelName" ? value : (prevData as any)[id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log(roomId);
    try {
      if (roomId !== undefined) {
        const updatedRoom = await updateRoomController(roomId, roomData);
        // Handles the server response after the update.
        console.log("Room updated successfully:", updatedRoom);
        updateRoomList(); // Call the function to update the Rooms list
        onClose(); // Close the modal after successful update.
      }
    } catch (error) {
      // Handle update request error.
      console.error("Error updating Room:", error);
    }
  };

  return (
    <>
      {onShow && (
        <div className="modal d-flex align-items-center justify-content-center custom-modal">
          <div className="modal-dialog modal-dialog-centered modal-lg w-75 modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary">
                <h5 className="modal-title text-white">Update Room</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>
              <div className="modal-body">
                <form className="px-4" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="roomNumber" className="py-2">
                        Number
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="roomNumber"
                        placeholder="Number"
                        value={roomData.roomNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="roomType" className="py-2">
                        Room Type
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="roomType"
                        placeholder="Room Type"
                        value={roomData.roomType}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="roomImgUrl" className="py-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="roomImgUrl"
                        placeholder="URL"
                        value={roomData.roomImgUrl}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="RoomDescription" className="py-2">
                        Description
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="roomDescription"
                        placeholder="Description"
                        value={roomData.roomDescription}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-6">
                      <label htmlFor="roomBasePrice" className="py-2">
                        Base Price
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="roomBasePrice"
                        placeholder="Room Price"
                        value={roomData.roomBasePrice}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="roomTax" className="py-2">
                        Room Tax
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="roomTax"
                        placeholder="Room Tax"
                        value={roomData.roomTax}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="py-2">Choose Room's state </label>
                      <select
                        className="form-select"
                        id="roomActive"
                        name="roomActive"
                        value={roomData.roomActive ? "1" : "2"}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>

                    <div className="col-12 mb-4">
                      <label htmlFor="rooms" className="py-2">
                        Assign Hotel
                      </label>
                      <select
                        className="form-select"
                        id="hotelName"
                        name="hotelName"
                        onChange={handleHotelSelectionChange}
                        required
                        value={roomData.hotelName}
                      >
                        {roomData.availableHotelNames.map((hotelName) => (
                          <option key={hotelName} value={hotelName}>
                            {hotelName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary mb-3 w-100"
                      >
                        Update Room
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

export default UpdateRoom;
