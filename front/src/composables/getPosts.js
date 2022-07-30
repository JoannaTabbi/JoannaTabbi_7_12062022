import {
    ref
} from 'vue'
import axios from 'axios'
import {
    useAuthStore
} from '@/stores/authStore'

// gets all posts
const getPosts = () => {
    let posts = []
    let error = null
    const loadPosts = () => {

        const auth = useAuthStore()
        const authOptions = {
            headers: {
                'Authorization': 'Bearer ' + auth.token
            }
        }
        axios.get(process.env.VUE_APP_API_URL + "posts/", {
                withCredentials: true
            }, authOptions)
            .then((res) => {
                if (res.ok) {
                   return res.json()
                }
            })
            .then((data) => {
                console.log(data)
                posts = data
            })
            .catch((err) => {
                error = err.message
                console.log(error)
            })


    }
    return {
        posts,
        error,
        loadPosts
    }
}

export default getPosts