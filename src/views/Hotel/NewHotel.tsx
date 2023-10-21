import React, { useState, useEffect, useRef } from "react";
import { Hotel } from "../../models/HotelModel";
import { Room } from "../../models/RoomModel";
import { createHotelController } from "../../controllers/HotelController";
import { getRoomsController } from "../../controllers/RoomController";

interface NewHotelProps {
  onShow: boolean;
  onClose: () => void;
  updateHotelList: () => void;
}

const NewHotel: React.FC<NewHotelProps> = ({
  onShow,
  onClose,
  updateHotelList,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotelData, setHotelData] = useState<Hotel>({
    hotelName: "",
    hotelAddress: "",
    hotelCity: "",
    hotelZipCode: "",
    hotelImgUrl: "",
    hotelDescription: "",
    hotelActive: true,
    roomNumbers: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    console.log("Input changed");
    const { id, value } = e.target;
    setHotelData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // Si el campo actual es 'hotelActive', convierte el valor a un booleano antes de asignarlo al estado
    if (id === "hotelActive") {
      setHotelData({ ...hotelData, [id]: value === "1" ? true : false });
    }
  };

  const roomsSelectRef = useRef<HTMLSelectElement | null>(null);

  const handleRoomSelectionChange = (): void => {
    if (roomsSelectRef.current) {
      const selectedRoomNumbers = Array.from(
        roomsSelectRef.current.selectedOptions,
        (option) => option.value
      );
      setHotelData((prevData) => ({
        ...prevData,
        roomNumbers: selectedRoomNumbers,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const newHotel = await createHotelController(hotelData);
      console.log("New hotel created:", newHotel);

      updateHotelList();
      onClose();
    } catch (error) {
      console.error("Error creating hotel:", error);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRoomsController();
        setRooms(response); // Almacena los datos de los cuartos en el estado local
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms(); // Llama a la función para obtener los cuartos cuando el componente se monta
    console.log("Hotel Data:", hotelData);
  }, [hotelData]);

  return (
    <>
      {onShow && (
        <div className="modal d-flex align-items-center justify-content-center custom-modal">
          <div className="modal-dialog modal-dialog-centered modal-lg w-75 modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary">
                <h5 className="modal-title text-white">Create Hotel</h5>
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
                      <label htmlFor="hotelName" className="py-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="hotelName"
                        placeholder="Name"
                        value={hotelData.hotelName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="hotelAddress" className="py-2">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="hotelAddress"
                        placeholder="Address"
                        value={hotelData.hotelAddress}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label htmlFor="hotelCity" className="py-2">
                        City
                      </label>
                      <select
                        className="form-select"
                        id="hotelCity"
                        name="hotelCity"
                        placeholder="City"
                        value={hotelData.hotelCity}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select City...</option>
                        <option value="Miami">Miami</option>
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                        <option value="San Francisco">San Francisco</option>
                        <option value="Houston">Houston</option>
                        <option value="Beverly Hills">Beverly Hills</option>
                        <option value="Chicago">Chicago </option>
                        <option value="Aspen">Aspen</option>
                        <option value="Palm Beach">Palm Beach</option>
                        <option value="Canyon Point">Canyon Point</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label htmlFor="hotelZipCode" className="py-2">
                        Zip Code
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="hotelZipCode"
                        placeholder="Zip Code"
                        value={hotelData.hotelZipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="hotelImgUrl" className="py-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="hotelImgUrl"
                      placeholder="URL"
                      value={hotelData.hotelImgUrl}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="hotelDescription" className="py-2">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="hotelDescription"
                      placeholder="Description"
                      value={hotelData.hotelDescription}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="py-2">Choose hotel's state </label>
                    <select
                      className="form-select"
                      id="hotelActive"
                      name="hotelActive"
                      value={hotelData.hotelActive ? "1" : "2"}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="1">Active</option>
                      <option value="2">Inactive</option>
                    </select>
                  </div>

                  <div className="col-12 mb-4">
                    <label htmlFor="rooms" className="py-2">
                      Assign Rooms (Ctrl + click to several)
                    </label>
                    <select
                      className="form-select"
                      id="roomNumbers"
                      name="roomNumbers"
                      onChange={handleRoomSelectionChange}
                      ref={roomsSelectRef}
                      multiple
                    >
                      {rooms.map((room) => (
                        <option key={room._id} value={room.roomNumber}>
                          {room.roomNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary mb-3 w-100"
                      >
                        Create Hotel
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

export default NewHotel;
