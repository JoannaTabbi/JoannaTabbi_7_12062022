<template>
    <main class="h-100">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-lg-3 mb-3 pt-3">
            <section id="home" class="shadow rounded-3 mb-3 p-3">
              <h1 class="text-start fs-3">Accueil</h1>
              <WelcomeCard/>
            </section>
          </div>
          <div
            class="h-100 col-12 col-md-8 col-lg-6 pt-3 border-start border-end"
          >
            <section
              id="create_post"
              class="shadow rounded-3 mb-3 p-3"
            >
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
import WelcomeCard from '../components/WelcomeCard.vue'
import CreatePost from '../components/CreatePost.vue'
import Post from '../components/Post.vue'
import MiniPost from '../components/MiniPost.vue'
import { useAuthStore } from '../stores/authStore'
export default {
  name: "App",
  components: {
    CreatePost,
    WelcomeCard,
    Post,
    MiniPost
  },
mounted(){
  const auth = useAuthStore()
  console.log(auth.user)
}
}
</script>

<style scoped></style>
