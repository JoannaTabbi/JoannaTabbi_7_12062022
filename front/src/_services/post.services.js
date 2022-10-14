import Axios from '@/_interceptors/axios'

//upload post image service: 

function createPost(formData) {

    return Axios.post("/posts/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }

export const postServices = {
    createPost
  }