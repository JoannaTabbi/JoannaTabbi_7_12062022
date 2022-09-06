import { defineStore } from "pinia";

export const useAuthStore = defineStore('AuthStore', {
state: () => {
    return {
        token: null,
        user: null
    }
},
persist: true,
actions: {
    // fetches the user information 
  loggedIn(token, user) {
    console.log("loggedIn marche")
    this.token = token;
    this.user = user;
  },
  loggedOut() {
    this.token = null;
    this.user = null;
  }
}

})