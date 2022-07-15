<template>
    <main>
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 col-md-8 col-lg-9 mb-3 pt-3 border-end">
            <section
              id="profile"
              class="shadow rounded-3 bg-white mb-3"
            >
              <ProfileCard />
            </section>
          </div>
          <div class="col-12 col-md-4 col-lg-3 pt-3">
            <section
              id="most_popular"
              class="shadow rounded-3 mb-3 p-2"
            >
              <h2 class="fs-4 text-start">Les plus populaires</h2>
            </section>
          </div>
        </div>
      </div>
    </main>
</template>

<script>
import ProfileCard from "../components/ProfileCard.vue"
export default {
  name: "App",
  components: {
    ProfileCard
  },
};
</script>

<style scoped>
</style>