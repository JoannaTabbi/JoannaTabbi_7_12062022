import { defineStore } from "pinia";

export const useAuthStore = defineStore('AuthStore', {
state: () => {
    return {
        token: null,
        user: null
    }
},
getters: {

},
actions: {
    // fetches the user information 
  loggedIn(token, user) {
    this.token = token;
    this.user = user;
  },
  loggedOut() {
    this.token = null;
    this.user = null;
  }
}

})