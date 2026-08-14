import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true // ye zaroori hai — session cookie bhejne/receive karne ke liye
});

export default api;