<template>
  <div class="ps-4 border-start">
    <div class="d-flex mb-3 border-bottom pb-2">
      <div class="img-sm-container me-3">
        <img
          class="mw-100 shadow rounded-3"
          src="../assets/avatar-200.png"
          alt="avatar"
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
            src="../assets/avatar-200.png"
            alt="avatar"
          />
        </div>
        <div>
          <div class="w-100 text-start bg-light rounded-3 p-2">
            <router-link to="/profile">
              <h5 class="fs-6 mb-0">Jean_Dupont</h5>
            </router-link>
            <p class="fs-6 mb-0">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi
              nam libero eveniet totam nulla.
            </p>
          </div>
          <ul class="nav nav-divider small justify-content-between align-items-center px-2">
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
export default {};
</script>

<style>
</style>
