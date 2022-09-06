<template>
  <div class="card card-body border-0 m-0 p-3">
    <span class="mx-5 border-top border-primary border-3"></span>
    <div class="d-flex align-items-center my-3 border-bottom border-top py-2">
      <div class="d-flex img-sm-container me-3 align-items-center">
        <img
          class="mw-100 shadow rounded-3"
          src="../assets/avatar-200.png"
          alt="avatar"
        />
      </div>
      <div class="w-100 text-start">
        <router-link to="/profile">
          <h5 class="fs-6 mb-0">{{postAuthor}}</h5>
        </router-link>
        <p class="mb-0 fw-light small fst-italic">{{postCreatedAt}}</p>
      </div>
      <!-- dropdown menu -->
      <div class="dropdown fs-2">
        <a
          href="#"
          role="button"
          id="dropdownMenuLink"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          ...
        </a>

        <ul class="dropdown-menu dropdown-menu-end text-end" aria-labelledby="dropdownMenuLink">
          <li><a class="dropdown-item" href="#">Modifiez votre publication</a></li>
          <li><a class="dropdown-item" href="#">Supprimez votre publication</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#">Signalez cette publication</a></li>
        </ul>
      </div>
    </div>
    <div class="card-img mb-3">
      <img
        class="w-100"
        src="https://picsum.photos/500/250?random=1"
        alt="image par default"
      />
    </div>
    <div>
      <p class="text-start">
        {{postMessage}}
      </p>
    </div>
    <ul class="nav d-flex justify-content-start mb-4 small">
      <li class="nav-item me-3">
        <a href="">
          <i class="fa-solid fa-thumbs-up fa-lg"></i>
          J'aime
          <span>(3)</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="">
          <i class="fa-solid fa-comment fa-lg"></i>
          Commentaire(s)
          <span>(5)</span>
        </a>
      </li>
    </ul>
    <!--  COMMENTS  -->
    <Comments />
  </div>
</template>

<script setup>
import Comments from "./Comments.vue";
defineProps(['postAuthor', 'postCreatedAt', 'postMessage'])
</script>

<style scoped></style>
>
