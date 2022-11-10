import axios from '@/_interceptors/axios';

// gets user's data by id given
let getUser = (uid) => {
  return axios.get('/auth/' + uid)
};

// gets authenticated user's data
let getOneself = () => {
    return axios.get('/auth')
};

// modifies user's data in the base
let updateUser = (credentials) => {
    return axios.put('/auth', credentials)
};

// deletes user's data from the base
let deleteUser = () => {
    return axios.delete('/auth')
};

// exports user's data 
let exportData = () => {
    return axios.get('/auth/export')
};

// adds followed user's id
let followUser = (uid) => {
    return axios.patch('/auth/' + uid + '/follow')
};

// removes followed user's id
let unfollowUser = (uid) => {
    return axios.patch('/auth/' + uid + '/unfollow')
};

// reports user for the id given
let reportUser = (uid) => {
    return axios.patch('/auth/' + uid + '/report')
};

// exports all user service functions
export const userServices = {
    getUser,
    getOneself,
    updateUser,
    deleteUser,
    exportData,
    followUser,
    unfollowUser,
    reportUser
}