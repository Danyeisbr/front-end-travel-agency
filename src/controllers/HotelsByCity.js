import axios from "../services/databaseService";

export const getHotelsByCityController = async (city) => {
  const response = await axios.get('/hotels/city', {
    params: {
      hotelCity: city,
    },
  });

  if (Array.isArray(response.data)) {
    return response.data;
  } else {
    console.error("Invalid response data format:", response.data);
    throw new Error("Invalid response data format");
  }
};