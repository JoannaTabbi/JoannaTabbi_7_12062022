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
      <div class="avatar col-6 col-sm-3 col-lg-2 ms-0 ms-lg-3 mb-3 mb-lg-0">
        <img
          src="../assets/avatar-200.png"
          class="img-fluid rounded-circle border border-white border-3 shadow"
          alt="mon avatar"
        />
      </div>
      <div
        class="col-12 col-lg-5 d-flex flex-column align-items-lg-start justify-content-end mb-3 mb-lg-0"
      >
        <h1 class="card-title fs-5 mb-0">Jean_Dupont</h1>
        <p class="card-text">Membre depuis le <span>12 juillet 2022</span></p>
      </div>
      <div
        class="col-12 col-lg-3 d-flex flex-wrap align-items-end justify-content-evenly ms-auto"
      >
        <router-link
          to="/modifyProfile"
          class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
          >Modifier le profil</router-link
        >
      </div>
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
          Followers
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
          Following
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
          Posts
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
        impedit ratione ad placeat beatae saepe eos assumenda dolorum fugit
        maiores accusantium, incidunt voluptates. Mollitia, reiciendis laborum.
        Reiciendis ex ad esse magni, explicabo quos? Totam, rerum iusto commodi
        cupiditate consequuntur provident reiciendis, officia autem cum
        dignissimos eaque aut ab dolor soluta ut architecto alias voluptates
        sint asperiores? Iure adipisci repellat tempora quia. Excepturi quae
        similique labore ab blanditiis ratione molestiae temporibus obcaecati
        qui. Ex error minus deserunt dignissimos esse!
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
            <MiniProfile />
            <MiniProfile />
            <MiniProfile />
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
            <MiniProfile />
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

<script>
import Post from "./Post.vue";
import MiniProfile from "./MiniProfileCard.vue";
export default {
  components: {
    Post,
    MiniProfile,
  },
};
</script>

<style>
.avatar {
  margin-top: -5%;
  margin-left: 30px;
}
</style>
