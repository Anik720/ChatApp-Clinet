import axios from "axios";
import { BASE_URL } from "./api";

const Fetch = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


// Fetch.interceptors.request.use(async (req) => {
//   const access_token = localStorage.getItem("authToken");
//   req.headers.Authorization = `Bearer ${access_token}`;
//   return req;
// });

export default Fetch;
