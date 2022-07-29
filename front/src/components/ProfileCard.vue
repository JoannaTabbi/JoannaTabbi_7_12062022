<template>
  <div class="card w-100 container p-0">
    <div class="row">
      <div class="col-12">
        <img
          class="img-fluid w-100 rounded-top"
          src="https://picsum.photos/800/200?random=1&grayscale"
          alt="photo aléatoire"
        />
      </div>
    </div>
    <div class="row d-flex flex-column flex-lg-row mb-3 align-items-center">
      <div
        class="avatar col-6 col-sm-3 col-lg-2 ms-0 ms-lg-3 mb-3 mb-lg-0 position-relative"
      >
        <img
          src="../assets/avatar-200.png"
          class="img-fluid rounded-circle border border-white border-3 shadow"
          alt="mon avatar"
        />
        <div
          class="position-absolute top-0 start-100 translate-middle btn btn-outline-dark rounded-circle"
        >
          <i class="fa-regular fa-thumbs-up fa-lg"></i>
        </div>
      </div>
      <div
        class="col-12 col-lg-4 d-flex flex-column align-items-lg-start justify-content-end mb-3 mb-lg-0"
      >
        <h1 class="card-title fs-5 mb-0">{{ userName }}</h1>
        <p class="card-text small">
          Membre depuis le <span>{{ createdAt }}</span>
        </p>
      </div>
      <div class="col-lg-1 dropdown">
        <a
          href="#"
          role="button"
          id="dropdownMenuLink"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          class="fs-3"
        >
          ...
        </a>

        <ul
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="dropdownMenuLink"
        >
          <li>
            <a class="dropdown-item" href="#">Signaler cet utilisateur</a>
          </li>
        </ul>
      </div>
      <ul
        class="nav col-lg-4 justify-content-center align-items-center ms-auto"
      >
        <li class="nav-item">
          <router-link
            to="/modifyProfile"
            class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
            >Modifier le profil</router-link
          >
        </li>
      </ul>
    </div>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          id="about-tab"
          data-bs-toggle="tab"
          data-bs-target="#about"
          type="button"
          role="tab"
          aria-controls="about"
          aria-selected="true"
        >
          A propos
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="followers-tab"
          data-bs-toggle="tab"
          data-bs-target="#followers"
          type="button"
          role="tab"
          aria-controls="followers"
          aria-selected="true"
        >
          Vous suivent
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="following-tab"
          data-bs-toggle="tab"
          data-bs-target="#following"
          type="button"
          role="tab"
          aria-controls="following"
          aria-selected="false"
        >
          Suivis
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          id="posts-tab"
          data-bs-toggle="tab"
          data-bs-target="#posts"
          type="button"
          role="tab"
          aria-controls="posts"
          aria-selected="false"
        >
          Publications
        </button>
      </li>
    </ul>
    <div class="tab-content m-4 text-start" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="about"
        role="tabpanel"
        aria-labelledby="about-tab"
      >
        {{ aboutMe }}
      </div>
      <div
        class="tab-pane fade"
        id="followers"
        role="tabpanel"
        aria-labelledby="followers-tab"
      >
        <div class="container">
          <div class="row g-3">
            <MiniProfile />
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="following"
        role="tabpanel"
        aria-labelledby="following-tab"
      >
        <div class="container">
          <div class="row g-3">
            <MiniProfile />
          </div>
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="posts"
        role="tabpanel"
        aria-labelledby="posts-tab"
      >
        <Post />
      </div>
    </div>
  </div>
</template>

<script setup>
import Post from "./Post.vue";
import MiniProfile from "./MiniProfileCard.vue";
defineProps(["userName", "createdAt", "aboutMe"]);

// gets all the posts created by one user
async function getUserPosts() {
  const posts = await axios.get(process.env.VUE_APP_API_URL + "posts");
}
</script>

<style>
.avatar {
  margin-top: -5%;
  margin-left: 30px;
}
</style>
