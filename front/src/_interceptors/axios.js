import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { authServices } from "@/_services/auth.services";

//create new instance for axios and defining url base for requests

let Axios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// intercepting any axios request to inject an access token to headers.Authorization
Axios.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// intercepting status 403 while the old access token is expiring; a new request is sent to
// auth/token to control the refresh token and receive a new access token
//let refresh = false;

Axios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    const auth = useAuthStore();
    if (err.response) {
      if (err.response.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await authServices.getRefreshToken(
            { refreshToken: auth.refreshToken }
          );

          
            auth.token = rs.data.accessToken;
            auth.refreshToken = rs.data.refreshToken;
            Axios.defaults.headers.common.Authorization = `Bearer ${rs.data.accessToken}`;

            return Axios(originalConfig);
          
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }
      if (err.response.status === 403 && err.response.data) {
        return Promise.reject(err.response.data);
      }
    }
    //refresh = false;
    return Promise.reject(err);;
  }
);

export default Axios;
