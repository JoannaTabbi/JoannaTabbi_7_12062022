import Axios from '@/_interceptors/axios'

//upload post image and message: 
let createPost = (formData) => {
    return Axios.post("/posts", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
};

// gets all the posts published
let getPosts = (page) => {
    return Axios.get(`/posts?page=${page}`)
};

// gets all the posts of one user
//warning: XMLHttpRequest seems to ignore the body of the request while using "get" method; 
//this issue was subverted by using "post" method
//see https://stackoverflow.com/questions/46404051/send-object-with-axios-get-request
let getUserPosts = (page, credentials) => {
    return Axios.post(`/posts/userPosts?page=${page}`, credentials)
};

//gets ont post
let getOnePost = (id) => {
    return Axios.get("/posts/" + id)
}

//updates one post
let updatePost = (id, formData) => {
    return Axios.put("/posts/" + id, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

// likes one post
let likePost = (id, payload) => {
    return Axios.post("/posts/" + id + "/like", payload)
}

//deletes one post 
let deletePost = (id) => {
    return Axios.delete("/posts/" + id)
}

export const postServices = {
    createPost,
    getPosts,
    getOnePost,
    updatePost,
    likePost,
    deletePost,
    getUserPosts
}