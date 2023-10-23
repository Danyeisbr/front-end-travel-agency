export interface Reservation {
  _id?: string;
  reservationNumber?: number;
  documentType: string;
  idNumberGuest: string;
  nameGuest: string;
  lastNameGuest: string;
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
  guests: string[];
  totalPriceReservation: number;
}
