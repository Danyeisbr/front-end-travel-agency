import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api-travel-app.azurewebsites.net/api/",
  //baseURL: "http://localhost:4000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
