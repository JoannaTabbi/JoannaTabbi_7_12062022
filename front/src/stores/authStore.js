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
  followersNb : (state) => state.user.followers.length,
  followingNb : (state) => state.user.following.length,
  avatarUrl : (state) => `${process.env.VUE_APP_URL}${state.user.imageUrl}`
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