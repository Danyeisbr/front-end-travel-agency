import React, { useState, useEffect, useRef } from "react";
import { Hotel } from "../../models/HotelModel";
import { getRoomsController } from "../../controllers/RoomController";
import {
  getHotelByIdController,
  updateHotelController,
} from "../../controllers/HotelController";

interface UpdateHotelProps {
  onShow: boolean;
  onClose: () => void;
  hotelId?: string;
  updateHotelList: () => void;
}

interface ExtendedHotel extends Hotel {
  availableRoomNumbers: string[];
}

const UpdateHotel: React.FC<UpdateHotelProps> = ({
  onShow,
  onClose,
  hotelId,
  updateHotelList,
}) => {
  const [hotelData, setHotelData] = useState<ExtendedHotel>({
    hotelName: "",
    hotelAddress: "",
    hotelCity: "",
    hotelZipCode: "",
    hotelImgUrl: "",
    hotelDescription: "",
    hotelActive: true,
    roomNumbers: [], // Pre-selected hotel rooms
    availableRoomNumbers: [], // Other room numbers available to add to the hotel
  });

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        if (hotelId !== undefined) {
          const response = await getHotelByIdController(hotelId);
          const availableRoomNumbers = await getRoomsController();

          setHotelData({
            ...response,
            roomNumbers: response.roomNumbers || [], // Números de habitación del hotel
            availableRoomNumbers: availableRoomNumbers.map(
              (room) => room.roomNumber
            ), // Números de habitación disponibles
          });
        }
      } catch (error) {
        console.error("Error fetching hotel data:", error);
      }
    };

    if (onShow) {
      fetchHotelData();
    }
  }, [onShow, hotelId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;
    setHotelData((prevState) => ({
      ...prevState,
      [id]: id === "hotelActive" ? value === "1" : value,
    }));
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
    console.log(hotelId);
    try {
      if (hotelId !== undefined) {
        const updatedHotel = await updateHotelController(hotelId, hotelData);
        // Maneja la respuesta del servidor después de la actualización.
        console.log("Hotel updated successfully:", updatedHotel);
        updateHotelList(); // Llama a la función para actualizar la lista de hoteles
        onClose(); // Cierra el modal después de la actualización exitosa.
      }
    } catch (error) {
      // Maneja el error de la solicitud de actualización.
      console.error("Error updating hotel:", error);
    }
  };

  return (
    <>
      {onShow && (
        <div className="modal d-flex align-items-center justify-content-center custom-modal">
          <div className="modal-dialog modal-dialog-centered modal-lg w-75 modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary">
                <h5 className="modal-title text-white">Update Hotel</h5>
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
                      <label htmlFor="addressHotel" className="py-2">
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
                        <option value="Miami">Miami</option>
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                        <option value="Houston">Houston</option>
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
                      Assign Rooms
                    </label>
                    <select
                      className="form-select"
                      id="roomNumbers"
                      name="roomNumbers"
                      onChange={handleRoomSelectionChange}
                      ref={roomsSelectRef}
                      multiple
                      required
                      value={hotelData.roomNumbers}
                    >
                      {hotelData.availableRoomNumbers.map((roomNumber) => (
                        <option key={roomNumber} value={roomNumber}>
                          {roomNumber}
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
                        Update Hotel
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

export default UpdateHotel;
