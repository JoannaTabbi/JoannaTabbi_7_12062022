import axios from "axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore('AuthStore', {
state: () => {
    return {
        token: null,
        refreshToken: null,
        user: null
    }
},
getters: {

},
actions: {
    // fetches the user information 
  loggedIn(token, user) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.user = user;
  },
  loggedOut() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
  }
}

})