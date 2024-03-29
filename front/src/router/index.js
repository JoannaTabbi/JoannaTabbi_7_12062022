import {
    createRouter,
    createWebHistory
} from "vue-router"
import {
    useAuthStore
} from "@/stores/authStore"
import Home from "@/views/Home"
import Signup from "@/views/Signup"
import Login from "@/views/Login"
import UserProfile from "@/views/UserProfile"
import MyProfile from "@/views/MyProfile"
import ModifyProfile from "@/views/ModifyProfile"
import NotFound from "@/views/NotFound"

// defines all the routes (pages) available
const routes = [{
        path: '/',
        name: "Home",
        component: Home
    },
    {
        path: '/signup',
        name: "Signup",
        component: Signup
    },
    {
        path: '/login',
        name: "Login",
        component: Login
    },
    {
        path: '/myProfile',
        name: "MyProfile",
        component: MyProfile
    },
    {
        path: '/modifyProfile',
        name: "ModifyProfile",
        component: ModifyProfile
    },
    {
        path: '/userProfile/:id',
        name: "UserProfile",
        component: UserProfile,
        props: true
    },
    {
        path: '/:pathMatch(.*)*',
        name: "NotFound",
        component: NotFound
    }

]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHistory(),
    routes // short for `routes: routes`
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login', '/signup'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.loggedOut();
        return '/login';
    }
});

export default router