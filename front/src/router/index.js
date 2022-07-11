import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/Home"
import Signup from "@/views/Signup"
import Login from "@/views/Login"
import Notifications from "@/views/Notifications"
import Profile from "@/views/Profile"
import UserProfile from "@/views/UserProfile"
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
        path: '/userProfile/:id', 
        name: "UserProfile",
        component: UserProfile
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: NotFound
    }

]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  });

export default router