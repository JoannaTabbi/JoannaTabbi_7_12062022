import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home"
import Signup from "@/views/Signup"
import Login from "@/views/Login"
import Notifications from "@/views/Notifications"
import Profile from "@/views/Profile"
import Search from "@/views/Search"
import UserProfile from "@/views/UserProfile"
import Trends from "@/views/Trends"
 

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
        path: '/notifications', 
        name: "Notificatons",
        component: Notifications
    },
    {
        path: '/profile', 
        name: "Profile",
        component: Profile
    },
    {
        path: '/search', 
        name: "Search",
        component: Search
    },
    {
        path: '/userProfile', 
        name: "UserProfile",
        component: UserProfile
    },
    {
        path: '/trends', 
        name: "Trends",
        component: Trends
    }

]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  });

export default router