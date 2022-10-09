import { defineStore } from "pinia";
import { userServices } from "@/_services";

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
  },
  editMyProfile() {
    userServices.getOneself()
      .then((res) => {
          this.user = res.data})
      .catch(err => console.log(err))
  },

  getFollowers(followersArray) {
    let userFollowers = this.user.followers;
    userFollowers.forEach((followerId)=> {
       userServices.getUser(followerId)
       .then((res) => {
        const foundFollower = res.data;
        followersArray.push(foundFollower)
       })
       .catch(err => console.log(err))
    }) 
  },

  getFollowing(followingArray) {
    let userFollowing = this.user.following;
    userFollowing.forEach((followingId) => {
       userServices.getUser(followingId)
       .then((res) => {
        const foundFollowing = res.data;
        followingArray.push(foundFollowing)
       })
       .catch(err => console.log(err))
    }) 
  }
}

})