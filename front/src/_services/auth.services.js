import axios from '@/_interceptors/axios';

let signupUser = (credentials) => {
  return axios.post('/auth/signup', credentials)
};

let loginUser = (credentials) => {
  return axios.post('/auth/login', credentials)
};

let logoutUser = () => {
  return axios.get('/auth/logout')
};

let getNewToken = () => {
  return axios.post('auth/token')
}

export const authServices = {
    signupUser,
    loginUser,
    logoutUser,
    getNewToken
}