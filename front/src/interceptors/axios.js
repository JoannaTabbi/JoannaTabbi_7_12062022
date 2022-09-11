import axios from "axios";

//create new instance for axios and defining url base for requests 

let Axios = axios.create({
    baseURL : process.env.VUE_APP_API_URL
})

// intercepting any axios request to inject an access token to headers.Authorization
Axios.interceptors.request.use(request => {

    const token = JSON.parse(localStorage.getItem('AuthStore')).token;
    if (token) {
        request.headers.Authorization = `Bearer ${token}`;
    }
    return request
})

// intercepting status 403 while the old access token is expiring; a new request is sent to 
// auth/token to control the refresh token and receive a new access token
let refresh = false;

Axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 403 && !refresh) {
        refresh = true;

        const {status, data} = await Axios.post('auth/token', {}, {
            withCredentials: true
        });

        if (status === 200) {
            Axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            return Axios(error.config);
        }
    }
    refresh = false;
    return error;
}); 

export default Axios;
