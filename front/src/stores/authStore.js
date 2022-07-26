import { defineStore } from "pinia";
import axios from 'axios';

const auth = axios.defaults.headers.common['Authorization'].split('')[1];

export const useAuthStore = defineStore('AuthStore', {
state: () => {
   let authenticated = false;
},
getters: {

},
actions: {

}

})