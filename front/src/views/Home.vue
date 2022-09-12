<template>
  <main class="h-100">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-lg-3 mb-3 pt-3">
          <section id="home" class="shadow rounded-3 mb-3 p-3">
            <h1 class="text-start fs-3">Accueil</h1>
            <WelcomeCard
              :avatar-url="user.imageUrl"
              :user-name="user.userName"
              :created-at="$filters.formatDate(user.createdAt)"
              :followers-number="followersNb"
              :following-number="followingNb"
            />
          </section>
        </div>
        <div
          class="h-100 col-12 col-md-8 col-lg-6 pt-3 border-start border-end"
        >
          <section id="create_post" class="shadow rounded-3 mb-3 p-3">
            <h2 class="text-start fs-4">Créez une publication</h2>
            <CreatePost />
          </section>
          <section id="feeds" class="shadow rounded-3 mb-3 p-3">
            <h2 class="text-start fs-4 fw-bolder">Fil d'actualité</h2>
            <Post />
          </section>
        </div>
        <div class="col-12 col-md-4 col-lg-3 pt-3">
          <section
            id="most_popular"
            class="shadow rounded-3 mb-3 py-3 ps-2 pe-4"
          >
            <h2 class="fs-4 text-start ms-2">Les plus populaires</h2>
            <div class="col-12">
              <MiniPost />
            </div>
            <div class="col-12">
              <MiniPost />
            </div>
            <div class="col-12">
              <MiniPost />
            </div>
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import WelcomeCard from "../components/WelcomeCard.vue";
import CreatePost from "../components/CreatePost.vue";
import Post from "../components/Post.vue";
import MiniPost from "../components/MiniPost.vue";
import { useAuthStore } from "../stores/authStore";
import { mapState } from "pinia";
export default {
  name: "Home",
  components: {
    CreatePost,
    WelcomeCard,
    Post,
    MiniPost,
  },
  mounted() {
    console.log("c'est ici"),
    ...mapState(useAuthStore, {
      user: "user",
      followersNb : (state) => state.user.followers.length,
      followingNb: "followingNb"
  }),
  },
  created() {
    this.followersNb,
    this.followingNb,
    this.avatarUrl
  }
};
</script>

<style scoped></style>
