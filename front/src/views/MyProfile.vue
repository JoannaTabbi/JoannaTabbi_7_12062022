<template>
  <main class="h-100 bg-dark">
    <div class="container-fluid main-content main-padding-top px-0 px-sm-3">
      <div class="row">
        <div class="col-12 mb-3 pt-3">
          <Profile :user="auth.user" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Profile from "@/components/Profile.vue";
import { useAuthStore } from "@/stores/authStore";
import { useHandleErrorStore } from "@/stores/handleErrorStore";
import { userServices } from "@/_services";

export default {
  name: "MyProfile",
  components: {
    Profile,
  },
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return { auth, handleError };
  },
  data() {
    return {
      followers: [],
      following: [],
    };
  },
  methods: {
    // displays user profile
    getMyProfile() {
      userServices
        .getOneself()
        .then((res) => {
          this.user = res.data;
        })
        .catch((err) => this.handleError.triggerToast(err));
    },
  },
  mounted() {
    this.getMyProfile();
  },
};
</script>