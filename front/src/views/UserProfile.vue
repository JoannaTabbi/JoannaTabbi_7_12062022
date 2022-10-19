<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
          <Profile
            :user="user"
            :user-profile="userProfile"
            :followButtonText="followButtonText"
            @submitFollow="followToggle"
          />
        </div>
        <div class="col-12 col-md-4 col-lg-3 pt-3">
          <MostPopular />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Profile from "@/components/Profile.vue";
import MostPopular from "@/components/MostPopular.vue";
import { useAuthStore } from "../stores/authStore";
import { userServices } from "@/_services";
export default {
  name: "UserProfile",
  components: {
    Profile,
    MostPopular,
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  data() {
    return {
      user: {},
      userProfile: true
    }
  },
  computed: {
    isFollowed: function() { 
      console.log(this.auth.user.following);
      console.log(typeof this.auth.user.following);
      const followingArr = Object.values(this.auth.user.following);
      console.log(followingArr);
      console.log(typeof followingArr);
      const found = followingArr.find((follower) => 
        follower._id == this.$route.params.id
      );
      console.log(found);
      console.log(typeof found);
     if (found) {
        return true;
      } else {
        return false;
      } 
    },
     followButtonText: function() {
      if (this.isFollowed === true)
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
          console.log(this.isFollowed)
        })
        .catch((error) => console.log(error));
    },

    //follows user
    followUser() {
      userServices
        .followUser(this.$route.params.id)
        .then((res) => {
          this.auth.user.following = res.data.userFollowing.following;
          this.user.followers = res.data.userFollowed.followers;
          console.log(this.isFollowed);
          console.log(this.followButtonText);
          
        })
        .catch((err) => console.log(err));
    },

    //unfollows user
    unfollowUser() {
      userServices
        .unfollowUser(this.$route.params.id)
        .then(async (res) => {
          this.auth.user.following = await res.data.userUnfollowing.following;
          this.user.followers = await res.data.userUnfollowed.followers;
          console.log(this.isFollowed);
          console.log(this.followButtonText);
        })
        .catch((err) => console.log(err));
    },
    //toggles between following and unfollowing user
    followToggle() {
      if(this.isFollowed === true) {
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
