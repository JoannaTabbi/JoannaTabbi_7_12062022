import { defineStore } from "pinia";

export const useAuthStore = defineStore('AuthStore', {
state: () => {
    return {
        token: null,
        refreshToken: null,
        user: null
    }
},
persist: true,
getters: {
  followersNb : (state) => state.user ? state.user.followers.length : 0,
  followingNb : (state) => state.user ? state.user.following.length : 0,
},
actions: {
    // fetches the user information 
  loggedIn(token, refreshToken, user) {
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