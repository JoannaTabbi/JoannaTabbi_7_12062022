import axios from '@/_interceptors/axios';

// signup
let signupUser = (credentials) => {
  return axios.post('/auth/signup', credentials)
};

// login
let loginUser = (credentials) => {
  return axios.post('/auth/login', credentials)
};

// logout
let logoutUser = () => {
  return axios.get('/auth/logout')
};

// get the new token once the old one is invalid
let getNewToken = () => {
  return axios.post('auth/token')
}

// export auth functions
export const authServices = {
    signupUser,
    loginUser,
    logoutUser,
    getNewToken
}