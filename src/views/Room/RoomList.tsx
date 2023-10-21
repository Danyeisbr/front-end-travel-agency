import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Room } from "../../models/RoomModel";
import { Hotel } from "../../models/HotelModel";
import MainForm from "../Form/MainForm";
import {
  getRoomsController,
  deleteRoomController,
} from "../../controllers/RoomController";
import { getHotelsByCityController } from "../../controllers/HotelsByCity";
import { RoomDetail } from "./RoomDetail";
import NewRoom from "./NewRoom";

interface FormData {
  hotelCity: string;
  checkInDate: Date;
  checkOutDate: Date;
  numGuests: number;
}

const RoomList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // Retrieve form data from local storage
  const storedFormData = localStorage.getItem("formData");
  const formData = storedFormData ? JSON.parse(storedFormData) : {};
  const [loading, setLoading] = useState(true);
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);

  const updateRoomList = async () => {
    const fetchedRooms = await getRoomsController();
    setRooms(fetchedRooms);
  };

  const handleUpdateRoom = (roomId: string) => {
    // Pass the updateRoomList function to the UpdateRoom and NewRoom component to update the list of Rooms after creating or modifying a Room
    return () => updateRoomList();
  };

  const handleDeleteRoom = async (roomId: string): Promise<void> => {
    try {
      await deleteRoomController(roomId);
      // Update the Roomes list after deleting one
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      console.log("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting Room:", error);
    }
  };

  const handleSearchHotel = async (formData: FormData) => {
    //Logic to manage the search for hotels by city
    try {
      const fetchedHotels = await getHotelsByCityController(formData.hotelCity);
      console.log("Filter hotels by city: " + fetchedHotels);
      setHotels(fetchedHotels);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    const fetchRoomsData = async () => {
      setLoading(true); // Room data loading from server
      try {
        const fetchedRooms = await getRoomsController();
        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false); // Loading is done
      }
    };
    fetchRoomsData();
  }, []);

  return (
    <>
      <section className="pb-4 mb-3 vh-100">
        <div className="container shadow bg-white">
          <div className="row">
            <div className="col-12 mt-4">
              <MainForm formData={formData} onSearch={handleSearchHotel} />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-2 col-md-12 col-sm-12">
              {isAuthenticated ? (
                <>
                  <div className="col-12 mb-3">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => setShowModal(true)}
                    >
                      Add Room
                    </button>
                  </div>
                  <h5>Explore More Options:</h5>
                  <button className="btn btn-secondary mb-2 d-block d-sm-none w-100">
                    Filter
                  </button>
                  <button className="btn btn-secondary mb-2 d-none d-sm-block w-100">
                    Filter Options
                  </button>
                  <button className="btn btn-info d-block d-sm-none w-100">
                    Bookmarked
                  </button>
                  <button className="btn btn-info d-none d-sm-block w-100">
                    See Bookmarked Hotels
                  </button>
                </>
              ) : (
                <>
                  <div className="col-6 mb-3">
                    <p> Ask for more information</p>
                  </div>
                  <h5>Explore More Options:</h5>
                  <button className="btn btn-secondary mb-2 d-block d-sm-none">
                    Filter
                  </button>
                  <button className="btn btn-secondary mb-2 d-none d-sm-block">
                    Filter Options
                  </button>
                  <h5>Benefits of Logging In:</h5>
                  <p>Unlock exclusive deals and discounts.</p>
                  <p>Save your favorite hotels for quick access.</p>
                  <p>
                    Receive personalized recommendations based on your
                    preferences.
                  </p>
                </>
              )}
            </div>
            <div className="col-lg-10 col-md-12 col-sm-12">
              <h1 className="mb-4">Choose a Room</h1>
              <div className="row loading-container">
                {loading && (
                  <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}
                {rooms.map((room) => (
                  <RoomDetail
                    key={room._id}
                    {...room}
                    onDelete={() => room._id && handleDeleteRoom(room._id)}
                    onUpdate={() => room._id && handleUpdateRoom(room._id)}
                    updateRoomList={updateRoomList}
                  />
                ))}
              </div>
            </div>
          </div>
          {showModal && (
            <NewRoom
              updateRoomList={updateRoomList}
              onShow={showModal}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default RoomList;
