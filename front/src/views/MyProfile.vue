<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
          <Profile
            :user="auth.user"
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
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "MyProfile",
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
      followers: [],
      following: [],
    };
  },
  mounted() {
    this.auth.editMyProfile();
    this.auth.getFollowers(this.auth.user.followers, this.followers);
    this.auth.getFollowing(this.auth.user.following, this.following);
  },
};
</script>


<style scoped></style>
