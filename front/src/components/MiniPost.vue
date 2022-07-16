<template>
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
     <!-- Modal -->
    <div
      class="modal fade"
      id="ModalPost"
      tabindex="-1"
      aria-labelledby="ModalPostLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ModalPostLabel">Post</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <Post />

          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
import Post from './Post.vue'
export default {
  components: {
    Post
  }
}
</script>

<style>

</style>