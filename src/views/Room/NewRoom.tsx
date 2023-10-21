import React, { useState, useEffect } from "react";
import { Room } from "../../models/RoomModel";
import { createRoomController } from "../../controllers/RoomController";
import { Hotel } from "../../models/HotelModel";
import { getHotelsController } from "../../controllers/HotelController";

interface NewRoomProps {
  onShow: boolean;
  onClose: () => void;
  updateRoomList: () => void;
}

interface ExtendedRoom extends Room {
  [key: string]: string | number | boolean | undefined;
}

const NewRoom: React.FC<NewRoomProps> = ({
  onShow,
  onClose,
  updateRoomList,
}) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomData, setRoomData] = useState<ExtendedRoom>({
    roomNumber: "",
    roomType: "",
    roomImgUrl: "",
    roomDescription: "",
    roomBasePrice: "",
    roomTax: "",
    roomActive: true,
    hotelName: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    console.log("Input changed");
    const { id, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    // If the current field is 'roomActive', convert the value to a boolean before assigning it to the state
    if (id === "roomActive") {
      setRoomData({ ...roomData, [id]: value === "1" ? true : false });
    }
  };

  const handleHotelSelectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [id]: id === "hotelName" ? value : prevData[id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const newRoom = await createRoomController(roomData);
      console.log("You have created a new room:", newRoom);
      updateRoomList();
      onClose();
    } catch (error) {
      console.error("Error creating Room:", error);
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotelsController();
        setHotels(response); // Store hotel data in the local state
      } catch (error) {
        console.log("Error fetching rooms:", error);
      }
    };
    fetchHotels();
  }, []);

  return (
    <>
      {onShow && (
        <div className="modal d-flex align-items-center justify-content-center custom-modal">
          <div className="modal-dialog modal-dialog-centered modal-lg w-75 modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary">
                <h5 className="modal-title text-white">Create Room</h5>
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
                      <label htmlFor="roomDescription" className="py-2">
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
                      >
                        {hotels.map((hotel) => (
                          <option key={hotel._id} value={hotel.hotelName}>
                            {hotel.hotelName}
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
                        Create Room
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

export default NewRoom;
