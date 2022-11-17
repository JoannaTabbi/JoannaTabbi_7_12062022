import Axios from "./api";
import {
    useAuthStore
} from '@/stores/authStore';
import {
    authServices
} from '@/_services/auth.services';


const axiosInterceptors = () => {

 // intercepting any axios request to inject an access token to headers - Authorization
Axios.interceptors.request.use(
    (request) => {

        const auth = useAuthStore();
        if (auth.token) {
            request.headers.Authorization = `Bearer ${auth.token}`;
        }
        return request
    },
    (error) => {
        return Promise.reject(error);
    })

// intercepting status 401 while the old access token is expiring; a new request is sent to 
// auth/token to control the refresh token and receive a new access token

Axios.interceptors.response.use(resp => resp, async err => {
    const auth = useAuthStore();
    const originalConfig = err.config;
    if (originalConfig.url !== "/auth/login" && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;
            try {
                const {
                    status,
                    data
                } = await authServices.getNewToken();
    
                if (status === 200) {
                    auth.token = data.accessToken;
                    auth.refreshToken = data.refreshToken;
                    Axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                    return Axios(originalConfig);
                }
            } catch (_error) {
                return Promise.reject(_error);
            }       
        }
    }
    
    return Promise.reject(err);
});
}

export default axiosInterceptors;