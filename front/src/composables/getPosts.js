import {
    ref
} from 'vue'
import axios from 'axios'
import {
    useAuthStore
} from '@/stores/authStore'

// gets all posts
const getPosts = () => {
    const posts = ref([])
    const error = ref(null)
    const loadPosts = async () => {

        const auth = useAuthStore()
        const authOptions = {
            headers: {
                'Authorization': 'Bearer ' + auth.token
            }
        }
        const res = await axios.get(process.env.VUE_APP_API_URL + "/posts/", {
                withCredentials: true
            }, authOptions)
        posts.value = res.data
        console.log(posts.value)

    }
    return {
        posts,
        error,
        loadPosts
    }
}

export default getPosts