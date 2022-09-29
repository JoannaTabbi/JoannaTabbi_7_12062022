<template>
  
            <Profile
              :user="auth.user"
              :createdAt="formattedData"
              
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
  
  computed: {
    formattedData() {
      return this.$filters.formatDate(this.auth.user.createdAt)
    }
    
  },
  mounted() {
    this.auth.editMyProfile()
  }
}
  
</script>


<style scoped></style>
