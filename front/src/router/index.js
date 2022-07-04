import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/Home";
import Login from "@/views/Login"

const routes = [
    {
        path: '/', 
        name: "Home",
        component: Home
    },
    {
        path: '/login', 
        name: "Login",
        component: Login
    }
]

const router = createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
  });

export default router;