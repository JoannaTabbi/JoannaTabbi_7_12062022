<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
          <Profile
            :user="user"
            :user-profile="true"
            :followers="followersArray"
            :following="followingArray"
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
      followersArray: [],
      followingArray: [],
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
      if (this.auth.user.following.includes(this.id)) {
        this.isFollowed = true, this.followButtonText = "Ne plus suivre"
        } else { this.isFollowed = false, this.followButtonText = "Suivre" }
    },

  //follows user
    followUser() {
      userServices.followUser(this.id)
        .then(async () => {
          await this.auth.user.following.push(this.id);
          this.isFollowed = true;
          this.followButtonText = "Ne plus suivre";
        })
        .catch((err) => console.log(err))
    },

  //unfollows user
    unfollowUser() {
      userServices.unfollowUser(this.id)
        .then(async () => {
          this.auth.user.following = await this.auth.user.following.filter(id => id !== this.id);
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
        this.auth.getFollowers(this.user.followers, this.followersArray);
        this.auth.getFollowing(this.user.following, this.followingArray);
        this.userIsFollowed();
        console.log(this.isFollowed, this.followButtonText);
      })
      .catch((error) => console.log(error));
  },
};
</script>

<style scoped></style>
