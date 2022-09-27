<template>
  
            <Profile
              :avatar-url="auth.user.imageUrl"
              :user-name="auth.user.userName"
              :created-at="$filters.formatDate(auth.user.createdAt)"
              :about-me="auth.user.aboutMe"
            />
          
</template>

<script>
import Profile from "@/components/Profile.vue";
import ProfileCard from "@/components/ProfileCard.vue";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "MyProfile",
  components : {
    Profile,
    ProfileCard
  },
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  mounted() {
    this.auth.editMyProfile()
  }
}
  
</script>


<style scoped></style>
