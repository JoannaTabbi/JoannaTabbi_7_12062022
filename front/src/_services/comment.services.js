import Axios from "@/_interceptors/axios";

//create comment message: 
let createComment = (payload) => {
    return Axios.post("/comments", payload)
};

//update comment message: 
let updateComment = (id, payload) => {
    return Axios.put("/comments/" + id, payload)
};


// likes one comment
let likeComment = (id, payload) => {
    return Axios.post("/comments/" + id + "/like", payload)
}

//deletes one comment
let deleteComment = (id) => {
    return Axios.delete("/comments/" + id)
}

//reports one comment
let reportComment = (id) => {
    return Axios.post("/comments/" + id + "/report")
}

export const commentServices = {
    createComment,
    updateComment,
    likeComment,
    deleteComment,
    reportComment
}