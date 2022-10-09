import axios from '@/_interceptors/axios';

// gets user's data by id given
let getUser = (id) => {
  return axios.get('/auth/' + id)
};

// gets authenticated user's data
let getOneself = () => {
    return axios.get('/auth')
};

//modifies user's data in the base
let updateUser = (credentials) => {
    return axios.put('/auth', credentials)
};

//deletes user's data from the base
let deleteUser = () => {
    return axios.delete('/auth')
};

//exports user's data 
let exportData = () => {
    return axios.get('/auth/export')
};

//adds followed user's id
let followUser = (id) => {
    return axios.patch('/auth/' + id + '/follow')
};

//removes followed user's id
let unfollowUser = (id) => {
    return axios.patch('/auth/' + id + '/unfollow')
};

//reports user for the id given
let reportUser = (id) => {
    return axios.patch('/auth/' + id + '/report')
};


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