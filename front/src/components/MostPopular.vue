<template>
  <div>
    <section
      id="most_popular"
      class="shadow rounded-3 mb-3 py-3 ps-2 pe-4"
    >
      <h2 class="fs-4 text-start ms-2">Les plus populaires</h2>
      <div class="col-12">
        <div class="card card-body border-0 m-0 p-2">
          <div class="d-flex">
            <div class="d-flex img-sm-container align-items-center">
              <i class="fa-solid fa-thumbs-up fa-md me-1"></i>
            </div>
            <div class="w-100 text-start bg-light rounded-3 p-2">
              <router-link to="/profile">
                <h5 class="fs-6 mb-0">Jean_Dupont</h5>
              </router-link>
              <a
                href=""
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#ModalPost"
                class="d-block"
              >
                <p class="text-start mb-0 text-truncate">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, quas.
                  Blanditiis possimus quasi, illo officia quaerat facere cupiditate nihil
                  ea ab porro, pariatur quibusdam unde provident vero perferendis minus
                  non et architecto illum deleniti autem repellendus! Dignissimos sint
                  nostrum aliquam odit rerum, hic corporis animi provident magni, quam
                  architecto autem delectus numquam blanditiis iste.
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

     <!-- Modal 

    <DynamicModal
      :modal-title="modalTitle"
      @closed="toggledModal">
        <template v-slot:modalBody>
          <p>
            <Post />
          </p>
        </template>
    </DynamicModal>  -->
  </div>
</template>

<script>
import Post from "./Post.vue";
import DynamicModal from "./DynamicModal.vue";
export default {
  name: "MiniPost",
  components: {
    Post,
    DynamicModal,
  },
  data() {
    return {
      modalTitle: "Post",
      showModal: false,
    };
  },
  methods: {
    // toggle modal
    toggledModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>

<style>
</style>