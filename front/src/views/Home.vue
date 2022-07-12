<template>
    <main class="h-100">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-lg-3 mb-3 pt-3">
            <section id="home" class="border border-2 rounded-3 mb-3 p-3">
              <h1 class="text-start fs-3">Accueil</h1>
            </section>
          </div>
          <div
            class="h-100 col-12 col-md-8 col-lg-6 pt-3 border-start border-end"
          >
            <section
              id="create_post"
              class="border border-2 rounded-3 mb-3 p-3"
            >
              <h2 class="text-start fs-4">Créez un poste</h2>
              <CreatePost />
            </section>
            <section id="feeds" class="border border-2 rounded-3 mb-3 p-3">
              <h2 class="text-start fs-4">Fil d'actualité</h2>
            </section>
          </div>
          <div class="col-12 col-md-4 col-lg-3 pt-3">
            <section
              id="most_popular"
              class="border border-2 rounded-3 mb-3 p-3"
            >
              <h2 class="fs-4 text-start">Les plus populaires</h2>
              <div class="col-12">post1</div>
              <div class="col-12">post2</div>
              <div class="col-12">post3</div>
            </section>
          </div>
        </div>
      </div>
    </main>
</template>

<script>
import CreatePost from '../components/CreatePost.vue'
export default {
  name: "App",
  components: {
    CreatePost
  },
};
</script>

<style scoped></style>
