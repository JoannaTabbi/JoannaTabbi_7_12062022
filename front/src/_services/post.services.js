import {
    ref
} from 'vue'
import Axios from 'axios'

//upload post image service: 

function createPost(formData) {

    return Axios.post("/posts/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }




/*
// gets all posts
const getPosts = () => {
    const posts = ref([])
    const error = ref(null)
    const loadPosts = async () => {

        const res = await axios.get(process.env.VUE_APP_API_URL + "/posts/", {
                
            }, authOptions)
        posts.value = res.data
        console.log(posts.value)

    }
    return {
        posts,
        error,
        loadPosts
    }
} */

export const postServices = {
    createPost
  }