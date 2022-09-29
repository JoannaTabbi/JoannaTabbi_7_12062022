<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
          <Profile :user="auth.user" :created-at="formattedDate" />
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
  computed: {
    // formates the the user account's creation date
    formattedDate() {
      return this.$filters.formatDate(this.auth.user.createdAt);
    },
  },
  mounted() {
    this.auth.editMyProfile();
  },
};
</script>


<style scoped></style>
