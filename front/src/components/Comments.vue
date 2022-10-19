<template>
  <div class="ps-4 border-start">
    <div class="d-flex mb-3 border-bottom pb-2">
      <div class="img-sm-container me-3">
        <img
          class="mw-100 shadow rounded-3"
          :src="auth.user.imageUrl"
          :alt="`avatar de ${auth.user.userName}`"
        />
      </div>
      <form class="w-100">
        <textarea
        
          class="form-control border-0 p-2"
          placeholder="Qu'en dites-vous?"
          rows="1"
        ></textarea>
      </form>
    </div>

    <!-- User's comments area -->
    <div class="my-4">
      <!-- one comment -->
      <div class="d-flex my-2 py-2">
        <div class="d-flex img-sm-container me-3 align-items-start">
          <img
            class="mw-100 shadow rounded-3"
            src=""
            alt="avatar"
          />
        </div>
        <div>
          <div class="w-100 text-start bg-light rounded-3 p-2">
            <div class="d-flex align-items-baseline justify-content-between">
              <div>
                <h5 class="fs-6 mb-0">Jean_Dupont</h5>
              </div>
              <div class="dropdown fs-5 fw-bold ">
                <a
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  ...
                </a>

                <ul
                  class="dropdown-menu dropdown-menu-end text-end"
                  aria-labelledby="dropdownMenuLink"
                >
                  <li>
                    <a class="dropdown-item" href="#"
                      >Modifiez votre commentaire</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" href="#"
                      >Supprimez votre commentaire</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" href="#"
                      >Signalez ce commentaire</a
                    >
                  </li>
                </ul>
              </div>
            </div>
            <p class="fs-6 mb-0">
              
            </p>
          </div>
          <ul
            class="nav nav-divider small justify-content-between align-items-center px-2"
          >
            <li class="nav-item">
              <a href="">J'aime</a>
            </li>
            <li class="nav-item">
              <a class="p-1 d-flex align-items-baseline">
                <span class="me-2">1</span>
                <i class="fa-solid fa-thumbs-up fa-lg"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!-- one comment end -->
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
export default {
  name: "Comments",
  props: ['comment', "post"],
  data() {
    return {
      comment: {
        message: "",

      }
    }
  },
  setup() {
    const auth = useAuthStore();
    return { auth }
  }
};
</script>

<style></style>
