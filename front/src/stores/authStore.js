import { defineStore } from "pinia";

export const useAuthStore = defineStore('AuthStore', {
state: () => {
    return {
        token: null,
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