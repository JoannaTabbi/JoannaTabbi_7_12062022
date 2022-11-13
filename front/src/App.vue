<template>
  <div>
    <!-- if no user stored in authstore, the header will not be injected to the page -->
    <Header v-if="auth.user" :user-name="auth.user.userName" />
    <router-view class="mx-0 mx-sm-auto"> </router-view>

    <!-- display toast to show errors -->
    <Teleport to="#modals">
      <Transition name="toast">
        <Toast
          v-if="handleError.showToast"
          :toast-message="handleError.toastMessage"
        />
      </Transition>
    </Teleport>
    <!-- <Footer /> -->
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Toast from "@/components/Toast.vue";
import { useAuthStore } from "@/stores/authStore.js";
import { useHandleErrorStore } from "@/stores/handleErrorStore";
export default {
  name: "App",
  components: {
    Header,
    Footer,
    Toast,
  },
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return { auth, handleError };
  },
};
</script>

<style>
#app {
  font-family: Lato, "Open sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4e5166;
}
img {
  object-fit: cover;
}
.main-content {
  max-width: 1200px;
}
.main-padding-top {
  padding-top: 70px;
}
.bg-connexion {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("./assets/integration.jpg");
}
.img-sm-container {
  width: 50px;
}
h1,
h2,
h5 {
  font-weight: bold;
}
a {
  text-decoration: none;
  color: #4e5166;
}
a:hover {
  color: #fd2d01;
}
textarea {
  resize: none;
}
.form-control:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
}
input:focus,
textarea:focus {
  background: radial-gradient(ellipse at 40% 50%, #ffebeb 30%, #fff 80%);
}
.pointer {
  cursor: pointer;
}
.pointer:hover {
  color: #fd2d01;
}
.like {
  color: #A71D01;
  font-weight: bold;
}
/* avatar common styling */
.avatar-container-round {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 3px 3px 15px lightgrey;
}
.avatar-container-round img {
  width: 110%;
  height: 110%;
}
.avatar-lg {
  width: 10rem;
  height: 10rem;
}

/* hide the redundant label text for everyone except the screenreaders */
.visuallyhidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
}
</style>
