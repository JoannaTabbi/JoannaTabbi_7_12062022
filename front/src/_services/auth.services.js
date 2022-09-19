import axios from '@/_interceptors/axios';

let signupUser = (credentials) => {
  return axios.post('/auth/signup', credentials)
};

let loginUser = (credentials) => {
  return axios.post('/auth/login', credentials)
};

let logoutUser = () => {
  return axios.get('/auth/logout', {},
  { withCredentials: true })
};

export const authServices = {
    signupUser,
    loginUser,
    logoutUser
}