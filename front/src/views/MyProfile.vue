<template>
  
            <Profile
              :user="auth.user"
              :user-profile="false"
            />
          
</template>

<script>
import Profile from "@/components/Profile.vue";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "MyProfile",
  components : {
    Profile
  },
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  computed() {
    auth.user.createdAt = $filters.formatDate(auth.user.createdAt)
  },
  mounted() {
    this.auth.editMyProfile()
  }
}
  
</script>


<style scoped></style>
