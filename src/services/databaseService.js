import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://test-17.azurewebsites.net/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(process.env.REACT_APP_API_BASE_URL);

export default axiosInstance;
