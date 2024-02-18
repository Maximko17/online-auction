import { getAccessToken } from "@/actions/auth";
import axios from "axios";
// import * as process from "process";

// const api = axios.create({
//   baseURL: process.env.BACKEND_HOST,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(async (config) => {
//   if (!config.headers.Authorization) {
//     const token = await getAccessToken();
//     if (token) {
//       config.headers.Authorization = token ? `Bearer ${token}` : "";
//     }
//   }
//   return config;
// });

const instance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async function (config) {
    console.log(typeof window === "undefined");
    if (!config.headers.Authorization) {
      const token = await getAccessToken();
      console.log(token);

      if (token) {
        config.headers.Authorization = token ? `Bearer ${token}` : "";
      }
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

export default instance;
