<template>
  <main>
    <div class="container main-content main-margin-top">
      <div class="row">
        <div class="col-12 mb-3 pt-3 border-end">
          <Profile
            :user="user"
            :user-profile="userProfile"
            :followButtonText="followButtonText"
            @submitFollow="followToggle"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Profile from "@/components/Profile.vue";
import { useAuthStore } from "../stores/authStore";
import { useHandleErrorStore } from "@/stores/handleErrorStore";
import { userServices } from "@/_services";
export default {
  name: "UserProfile",
  components: {
    Profile
  },
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return { auth, handleError };
  },
  data() {
    return {
      user: {},
      userProfile: true
    }
  },
  computed: {
    //transforms user.following object in array, then checks if params.id is present 
    //inside
    isFollowed: function() { 
      const followingArr = Object.values(this.auth.user.following);
      const found = followingArr.some((follower) => 
        follower._id == this.$route.params.id
      );
      return found
    },
     followButtonText: function() {
      if (this.isFollowed)
     { return "Ne plus suivre" } 
     else {return "Suivre" }  
     }
  },
  // checks if user is already followed, then switches isFollowed value between true and false,
  // followButtonText value between "Follow" and "unfollow" ; this will help to activate
  // the right method (follow / unfollow) while clicking on the follow button
  methods: {
    
    // fetching information about user from database
    getUser() {
      userServices
        .getUser(this.$route.params.id)
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => this.handleError.triggerToast(err));
    },

    //follows user
    followUser() {
      userServices
        .followUser(this.$route.params.id)
        .then((res) => {
          this.auth.user.following = res.data.userFollowing.following;
          this.user.followers = res.data.userFollowed.followers;
        })
        .catch((err) => this.handleError.triggerToast(err));
    },

    //unfollows user
    unfollowUser() {
      userServices
        .unfollowUser(this.$route.params.id)
        .then((res) => {
          this.auth.user.following = res.data.userUnfollowing.following;
          this.user.followers = res.data.userUnfollowed.followers;
        })
        .catch((err) => this.handleError.triggerToast(err));
    },
    //toggles between following and unfollowing user
    followToggle() {
      if(this.isFollowed) {
        return this.unfollowUser()
      } else {
        return this.followUser()
      }
    },
  },
  mounted() {
    this.getUser();
  }
};
</script>

<style scoped></style>
