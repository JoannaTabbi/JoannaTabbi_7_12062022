<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
          <Profile
            :user="auth.user"
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
import { useHandleErrorStore } from "@/stores/handleErrorStore";
import { userServices } from "@/_services";

export default {
  name: "MyProfile",
  components: {
    Profile,
    MostPopular,
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
    userServices.getOneself()
      .then((res) => {
          this.user = res.data})
      .catch(err => console.log(err))
  }
  },
  mounted() {
    this.getMyProfile();
  },
};
</script>


<style scoped></style>
