import axios from "../services/databaseService";

interface EmailBody {
  reservationData: {
    reservationNumber: number;
    nameGuest: string;
    lastNameGuest: string;
    documentType: string;
    idNumberGuest: string;
    genderGuest: string;
    emailGuest: string;
    phoneGuest: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    checkIn: Date;
    checkOut: Date;
    lodgingCity: string;
    hotelNameReservation: string;
    roomNumberReservation: string;
    reservationActive: boolean;
    _id?: string;
  };
  additionalGuestNames: string[];
}

export const sendEmailController = async (emailBody: EmailBody) => {
  const response = await axios.post("/email", {
    emailBody: emailBody,
  });
  return response.data;
};
