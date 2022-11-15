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

// intercepting status 403 while the old access token is expiring; a new request is sent to 
// auth/token to control the refresh token and receive a new access token
let refresh = false;

Axios.interceptors.response.use(resp => resp, async error => {
    const auth = useAuthStore();
    if (error.response.status === 401 && !refresh) {
        refresh = true;
        try {
            const {
                status,
                data
            } = await authServices.getNewToken();

            if (status === 200) {
                auth.token = data.accessToken;
                auth.refreshToken = data.refreshToken;
                Axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

                return Axios(error.config);
            }
        } catch (_error) {
            return Promise.reject(_error);
        }
    }
    refresh = false; // avoids that the request turn in infinite loop
    return Promise.reject(error);
});
}

export default axiosInterceptors;