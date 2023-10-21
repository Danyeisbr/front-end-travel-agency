export interface Hotel {
    _id?: string;
    hotelName: string;
    hotelAddress: string;
    hotelCity: string;
    hotelZipCode: string;
    hotelImgUrl: string;
    hotelDescription: string;
    hotelActive: boolean;
    roomNumbers: string[];
  }
