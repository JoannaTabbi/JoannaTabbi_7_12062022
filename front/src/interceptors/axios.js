import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
    if (error.response.status === 403 && !refresh) {
        refresh = true;

        const {status, data} = await axios.post('token', {}, {
            withCredentials: true
        });

        if (status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});