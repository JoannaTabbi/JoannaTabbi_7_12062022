import {
  defineStore
} from "pinia";

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
    followersNb: (state) => state.user ? state.user.followers.length : 0,
    followingNb: (state) => state.user ? state.user.following.length : 0,
  },
  actions: {
    // register token, refreshToken and current user data once logged in 
    loggedIn(token, refreshToken, user) {
      this.token = token;
      this.refreshToken = refreshToken;
      this.user = user;
    },
    //removes token, refreshtoken and users data from the store once the current user logged out
    loggedOut() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
    },

    // switches the link to myProfile page if the profile card belongs to the authenticated user 
    // or to userProfile page if it belongs to other user
    profilePage(uid) {
      if (uid) {
        if (uid === this.user._id) {
          return {
            name: 'MyProfile'
          }
        } else {
          return {
            name: 'UserProfile',
            params: {
              id: uid
            }
          }
        }
      }

    }
  }

})