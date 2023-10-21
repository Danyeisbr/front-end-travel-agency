// Contains the hotel control logic (handling requests to the server).
import axios from "../services/databaseService";
import { Hotel } from "../models/HotelModel";

export const getHotelsController = async (): Promise<Hotel[]> => {
  const response = await axios.get("/hotels");
  return response.data;
};

export const getHotelByIdController = async (id: string): Promise<Hotel> => {
  const response = await axios.get("/hotels/" + id);
  return response.data;
};

export const createHotelController = async (
  newHotel: Hotel
): Promise<Hotel> => {
  const response = await axios.post("/hotels", newHotel);
  return response.data;
};

export const updateHotelController = async (
  hotelId: string,
  updatedHotel: Hotel
): Promise<Hotel> => {
  const response = await axios.put("/hotels/" + hotelId, updatedHotel);
  await axios.put("/hotels/" + hotelId, updatedHotel);
  return response.data;
};

export const deleteHotelController = async (
  hotelId: string
): Promise<Hotel> => {
  const response = await axios.delete("/hotels/" + hotelId);
  return response.data;
};

// export const getHotelsByCityController = async (city?: string): Promise<Hotel[]> => {
//   try {
//     const params: any = { hotelCity: city || '' };

//     const config: AxiosRequestConfig = {
//       params,
//     };

//     const response: AxiosResponse<Hotel[]> = await axios.get('/hotels/city', config);

//     if (Array.isArray(response.data)) {
//       return response.data;
//     } else {
//       console.error("Invalid response data format:", response.data);
//       throw new Error("Invalid response data format");
//     }
//   } catch (error) {
//     console.error("Error getting hotels by city:", error);
//     throw error; 
//   }
// };


// export const getHotelsByCityController = async (city?: string): Promise<Hotel[]> => {
//   const response = await axios.get('/hotels/city', {
//     params: {
//       hotelCity: city,
//     },
//   });

//   if (Array.isArray(response.data)) {
//     return response.data;
//   } else {
//     console.error("Invalid response data format:", response.data);
//     throw new Error("Invalid response data format");
//   }
//   //return response.data;
// };