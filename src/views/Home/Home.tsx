import React, { useState } from "react";
import MainForm from "../Form/MainForm";
import { useHistory } from "react-router-dom";
import "../../assets/styles/home.css";

interface FormData {
  hotelCity: string;
  checkInDate: Date;
  checkOutDate: Date;
  numGuests: number;
}

const Home: React.FC = () => {
  const history = useHistory();

  // Retrieve data from localStorage and convert numGuests to number
  const storedFormData = localStorage.getItem("formData");
  const initialFormData: FormData = storedFormData
    ? {
        ...JSON.parse(storedFormData),
        numGuests: parseInt(JSON.parse(storedFormData).numGuests, 10),
      }
    : {
        hotelCity: "",
        checkInDate: new Date(),
        checkOutDate: new Date(),
        numGuests: 1,
      };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSearchHotel = (formData: FormData) => {
    // Convert numGuests to number before storing it in localStorage
    const formDataToStore = {
      ...formData,
      numGuests: parseInt(formData.numGuests.toString(), 10),
    };
    // Store form data in local storage
    localStorage.setItem("formData", JSON.stringify(formDataToStore));
    history.push("/hotels");
  };

  return (
    <section className="col-12 vh-90 bg-image">
      <div className="col-12 container h-100 d-flex justify-content-center align-items-start">
        <div className="row mt-5">
          <div className="col-12 text-center mb-4">
            <div className="row align-items-center">
              <div className="col text-end">
                <h1 className="text-white fw-bold">
                  FIND A HOTEL <br />
                  AND PLAN THE
                </h1>
              </div>
              <div className="col text-start">
                <h2 className="signature-text">perfect getaway</h2>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <MainForm formData={formData} onSearch={handleSearchHotel} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
