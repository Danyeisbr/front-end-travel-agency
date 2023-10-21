import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getHotelsController } from "../../controllers/HotelController";
import { Hotel } from "../../models/HotelModel";
import ModalError from "./ModalError";

interface MainFormProps {
  formData: {
    hotelCity: string;
    checkInDate: Date;
    checkOutDate: Date;
    numGuests: number;
  };
  onSearch: (formData: {
    hotelCity: string;
    checkInDate: Date;
    checkOutDate: Date;
    numGuests: number;
  }) => void;
}

const MainForm: React.FC<MainFormProps> = ({ formData, onSearch }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [uniqueCities, setUniqueCities] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [localFormData, setLocalFormData] = useState({
    hotelCity: "",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    numGuests: 1,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { id, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [id]: id === "numGuests" ? parseInt(value, 10) : value,
    }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      hotelCity: value,
    }));
  };

  const areAllFieldsFilled = (): boolean => {
    const { hotelCity, checkInDate, checkOutDate, numGuests } = localFormData;
    return !!hotelCity && !!checkInDate && !!checkOutDate && !!numGuests;
  };

  const handleSearchHotel = (): void => {
    if (areAllFieldsFilled() && !showErrorModal) {
      localStorage.setItem("formData", JSON.stringify(localFormData));
      onSearch(localFormData);
    }
  };

  const isFormEmpty = !areAllFieldsFilled();

  const handleDateChange = (date: Date | null, field: string) => {
    if (date !== null) {
      // Check if it is checkInDate or checkOutDate and perform the necessary validation
      if (field === "checkInDate") {
        // If it is checkInDate, just update the state
        setLocalFormData((prevData) => ({
          ...prevData,
          [field]: date,
        }));
      } else if (field === "checkOutDate" && date > localFormData.checkInDate) {
        // If it is checkOutDate and is after checkInDate, updates the state and hides the error modal
        setLocalFormData((prevData) => ({
          ...prevData,
          [field]: date,
        }));
        setShowErrorModal(false);
      } else {
        // If checkOutDate and not later than checkInDate, show error modal
        setShowErrorModal(true);
      }
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await getHotelsController();
        setHotels(response); // Store hotel data in the local state
        // Extract unique cities from hotels using a Set
        const citiesSet = new Set(response.map((hotel) => hotel.hotelCity));
        // Convert the Set to an array to render the selector options
        setUniqueCities(Array.from(citiesSet));
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData);
      // Convert numGuests to number when loading data from localStorage
      const checkInDate = new Date(parsedData.checkInDate);
      const checkOutDate = new Date(parsedData.checkOutDate);

      setLocalFormData({
        ...parsedData,
        checkInDate, // make sure checkInDate is a Date object
        checkOutDate, // make sure checkOutDate is a Date object
        numGuests: parseInt(parsedData.numGuests, 10), 
      });
    }
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <form>
      <div className="row">
        <div className="col-lg-4 col-md-12 col-sm-12 mb-3">
          <label className="form-label">Where to? (Required)</label>
          <select
            className="form-select"
            id="hotelCity"
            name="hotelCity"
            value={localFormData.hotelCity}
            onChange={handleCityChange}
            required
          >
            <option value="">Select City...</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
          <label className="form-label w-100">Check-in</label>
          <DatePicker
            selected={localFormData.checkInDate}
            onChange={(date) => handleDateChange(date, "checkInDate")}
            className="form-control d-block"
            id="checkInDate"
            required
          />
        </div>
        <div className="col-lg-2 col-md-6 col-sm-12 mb-3">
          <label className="form-label w-100">Check-out</label>
          <DatePicker
            selected={localFormData.checkOutDate}
            onChange={(date) => handleDateChange(date, "checkOutDate")}
            className="form-control d-block"
            id="checkOutDate"
            required
          />
        </div>
        <ModalError
          show={showErrorModal}
          onHide={() => setShowErrorModal(false)}
        />
        <div className="col-lg-2 col-md-12 col-sm-12 mb-3">
          <label className="form-label">Guests</label>
          <select
            className="form-select"
            id="numGuests"
            value={localFormData.numGuests}
            onChange={handleInputChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <div className="col-lg-2 col-md-12 col-sm-12 mb-3 d-flex justify-content-center align-items-end">
          <button
            type="button"
            id="searchHotel"
            className="btn btn-primary w-100"
            onClick={handleSearchHotel}
            disabled={isFormEmpty || showErrorModal}
          >
            Search Hotel
          </button>
        </div>
      </div>
    </form>
  );
};

export default MainForm;
