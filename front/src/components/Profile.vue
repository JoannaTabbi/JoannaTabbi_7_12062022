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
import ProfileCard from "@/components/ProfileCard.vue"
import MiniPost from '@/components/MiniPost.vue'
export default {
   name: "Profile",
   components: {
      ProfileCard,
      MiniPost
  },
}
</script>

<style>

</style>