<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
          <Profile
            :user="user"
            :user-profile="true"
            :followButtonText="followButtonText"
            @followToggle="followToggle"
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
import { useAuthStore } from '../stores/authStore';
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
  props: ["id"],
  data() {
    return {
      user: {},
      followButtonText: {
        type: String
      },
      isFollowed: {
        type: Boolean
      }
    };
  },
  methods: {
  // checks if user is already followed, then switches isFollowed value between true and false,  
  // followButtonText value between "Follow" and "unfollow" ; this will help to activate 
  // the right method (follow / unfollow) while clicking on the follow button
  userIsFollowed() {
    const followingArr = Object.values(this.auth.user.following);
    const found = followingArr.find(elt => elt._id === this.id);
      if (found) {
        this.isFollowed = true; 
        this.followButtonText = "Ne plus suivre";
        } else {
          this.isFollowed = false; 
          this.followButtonText = "Suivre"
        }
    },

  //follows user
    followUser() {
      userServices.followUser(this.id)
        .then(async (res) => {
          this.auth.user.following = await res.data.userFollowing.following;
          this.user.followers = await res.data.userFollowed.followers;
          this.isFollowed = true;
          this.followButtonText = "Ne plus suivre";
        })
        .catch((err) => console.log(err))
    },

  //unfollows user
    unfollowUser() {
      userServices.unfollowUser(this.id)
        .then(async (res) => {
          this.auth.user.following = await res.data.userUnfollowing.following;
          this.user.followers = await res.data.userUnfollowed.followers;
          this.isFollowed = false;
          this.followButtonText = "Suivre";
        })
        .catch((err) => console.log(err)) 
    },
  //toggles between following and unfollowing user
    followToggle() {
      this.isFollowed ? this.unfollowUser() : this.followUser()
    }
  },
  mounted() {
    // fetching information about user from database
    userServices
      .getUser(this.id)
      .then((res) => {
        this.user = res.data;
        this.userIsFollowed();
      })
      .catch((error) => console.log(error));
  },
};
</script>

<style scoped></style>
