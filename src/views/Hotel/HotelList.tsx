import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { Hotel } from "../../models/HotelModel";
import MainForm from "../Form/MainForm";
import {
  getHotelsController,
  deleteHotelController,
} from "../../controllers/HotelController";
import {getHotelsByCityController} from "../../controllers/HotelsByCity";
import { HotelDetail } from "./HotelDetail";
import NewHotel from "./NewHotel";
import "../../assets/styles/hotel-list.css";

interface FormData {
  hotelCity: string;
  checkInDate: Date;
  checkOutDate: Date;
  numGuests: number;
}

const HotelList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // Retrieve form data from local storage
  const storedFormData = localStorage.getItem("formData");
  const formData = storedFormData ? JSON.parse(storedFormData) : {};
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [showModal, setShowModal] = useState(false);

  const updateHotelList = async () => {
    const fetchedHotels = await getHotelsController();
    setHotels(fetchedHotels);
  };

  const handleUpdateHotel = (hotelId: string) => {
    // Pass the updateHotelList function to the UpdateHotel and NewHotel component to update the list of hotels after creating or modifying a hotel
    return () => updateHotelList();
  };

  const handleDeleteHotel = async (hotelId: string): Promise<void> => {
    try {
      await deleteHotelController(hotelId);
      // Updates the list of hotels after deleting one
      setHotels((prevHotels) =>
        prevHotels.filter((hotel) => hotel._id !== hotelId)
      );
    } catch (error) {
      console.error("Error deleting hotel:", error);
    }
  };

  const handleSearchHotel = async (formData: FormData) => {
    // Logic to manage the search for hotels by city
    try {
      const fetchedHotels = await getHotelsByCityController(formData.hotelCity);
      setHotels(fetchedHotels);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    const fetchHotelsData = async () => {
      setLoading(true); // Hotel data loading from server
      try {
        const fetchedHotels = await getHotelsController();
        setHotels(fetchedHotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoading(false); // Loading is done
      }
    };
    fetchHotelsData();
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
                  <button
                    className="btn btn-primary w-100 mb-3"
                    onClick={() => setShowModal(true)}
                  >
                    Add Hotel
                  </button>
                  <h5>Explore More Options:</h5>
                  <button className="btn btn-secondary mb-2 d-block d-sm-none">
                    Filter
                  </button>
                  <button className="btn btn-secondary mb-2 d-none d-sm-block w-100">
                    Filter Options
                  </button>
                  <button className="btn btn-info d-block d-sm-none">
                    Bookmarked
                  </button>
                  <button className="btn btn-info d-none d-sm-block">
                    See Bookmarked Hotels
                  </button>
                </>
              ) : (
                <>
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
              <h1 className="mb-4">Choose a Hotel</h1>
              <div className="row loading-container">
                {loading && (
                  <div className="loading-overlay">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                )}

                {hotels.map((hotel) => (
                  <HotelDetail
                    key={hotel._id}
                    {...hotel}
                    onDelete={() => hotel._id && handleDeleteHotel(hotel._id)}
                    onUpdate={() => hotel._id && handleUpdateHotel(hotel._id)}
                    updateHotelList={updateHotelList}
                  />
                ))}
              </div>
            </div>
            {showModal && (
              <NewHotel
                updateHotelList={updateHotelList}
                onShow={showModal}
                onClose={() => setShowModal(false)}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HotelList;
