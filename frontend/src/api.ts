import axios from "axios";

const api = axios.create({
  baseURL: "https://bookit-fullstack-51wv.onrender.com/api",
});

export default api;
