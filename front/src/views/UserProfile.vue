<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
          <Profile
            :user="this.user"
            :created-at="formattedDate"
            :user-profile="true"
            :followers="followers"
            :following="following"
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
      followers: [],
      following: []
    };
  },
  computed: {
    // formates the the user account's creation date
    formattedDate() {
      return this.$filters.formatDate(this.user.createdAt);
    },
  },
  mounted() {
    // fetching information about user from database
    userServices
      .getUser(this.id)
      .then((res) => {
        this.user = res.data;
        this.auth.getFollowers(this.user.followers, this.followers);
        this.auth.getFollowing(this.user.following, this.following);
      })
      .catch((error) => console.log(error));
  },
};
</script>

<style scoped></style>
