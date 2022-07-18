import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home"
import Signup from "@/views/Signup"
import Login from "@/views/Login"
import Profile from "@/views/Profile"
import ModifyProfile from "@/views/ModifyProfile"
import NotFound from "@/views/NotFound"
 

const routes = [
    {
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
        path: '/profile', 
        name: "Profile",
        component: Profile
    },
    {
        path: '/modifyProfile', 
        name: "ModifyProfile",
        component: ModifyProfile
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
    routes, // short for `routes: routes`
  });

export default router