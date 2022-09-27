<template>
  <Profile
    :avatar-url="this.user.imageUrl"
    :user-name="this.user.userName"
    :created-at="$filters.formatDate(this.user.createdAt)"
    :about-me="this.user.aboutMe"
    :user-profile="userProfile=true"
  />
</template>

<script>
import Profile from "@/components/Profile.vue";
import { userServices } from "@/_services";
export default {
  name: "UserProfile",
  components: {
    Profile,
  },
  props: ["id"],
  data() {
    return {
      user: {},
    };
  },
  mounted() {
    // fetching information about user from database
    userServices
      .getUser(this.id)
      .then((res) => {
        console.log(res.data);
        this.user = res.data;
      })
      .catch((error) => console.log(error));
  },
};
</script>

<style scoped></style>
