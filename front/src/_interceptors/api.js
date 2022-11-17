import axios from "axios";

// create new instance for axios, define url base for requests, 
// add default content-type header 
// set credentials to true in order to handle cookies

let Axios = axios.create({
    baseURL: process.env.VUE_APP_URL + "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})

export default Axios