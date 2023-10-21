import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-travel-app.azurewebsites.net/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
