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
  followersNb : store => store.user.followers.length,
  followingNb : store => store.user.following.length,
  avatarUrl : (store) => {
    store.user.imageUrl ? 
        require(`@/assets/avatar-200.png`) : require('@/assets/logos/icon-left-font.png')
          }
},
actions: {
    // fetches the user information 
  loggedIn(token, refreshToken, user) {
    console.log("loggedIn marche")
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