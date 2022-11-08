<template>
<div class="row">
  <div v-for="mpUser in mpUsers" :key="mpUser._id" class="col-12 col-sm-6 col-md-4 col-lg-3">
    <router-link :to="auth.profilePage(mpUser._id)">
      <div class="card border-0 align-items-center p-2">
        <div class="avatar-container col-8 mb-3 d-flex justify-content-center">
          <img
            :src="mpUser.imageUrl"
            alt="mon avatar"
          />
        </div>
        <div class="col-12 mb-3 mb-lg-0">
          <h3 class="card-title text-center fs-6 mb-0">{{mpUser.userName}}</h3>
        </div>
      </div>
</router-link>
  </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
export default {
  name: "MiniProfileCard",
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  props: ['mpUsers', 'mpUsersArr'] 
}
</script>

<style>
.avatar-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 3px 3px 15px lightgrey;
};
.avatar-container img {
  object-fit: cover;
}
</style>
