<template>
  <div class="card w-100 flex-sm-row flex-lg-column align-items-center">
    <div class="p-5 p-sm-3 p-lg-5">
      <img
        :src="avatarUrl"
        class="img-fluid card-img-top shadow border border-white border-3 rounded-circle"
        alt="mon avatar"
      />
    </div>

    <div class="card-body">
      <h5 class="card-title">
        Bonjour
        <span
          ><router-link to="/myProfile">{{ userName }}</router-link></span
        >
      </h5>

      <small class="card-text"
        >Membre depuis le
        <div>{{ createdAt }}</div></small
      >
    </div>
    <ul class="list-group list-group-flush small">
      <li
        class="list-group-item d-flex flex-wrap align-items-center justify-content-between"
      >
        <router-link to="/myProfile" class="fw-bold text-dark me-2">
          <span>{{ followersNumber }}</span>
          <span class="ms-1">Vous suivent</span>
        </router-link>
        <router-link to="/myProfile" class="fw-bold text-dark">
          <span>{{ followingNumber }}</span>
          <span class="ms-1">Suivis</span>
        </router-link>
      </li>
      <li class="list-group-item">
        <router-link to="/myProfile" class="fw-bold text-dark">
          <span>{{ postsNumber }}</span>
          <span class="ms-1">Publications</span>
        </router-link>
      </li>

      <li
        class="list-group-item d-flex flex-wrap align-items-center justify-content-evenly"
      >
        <router-link
          to="/modifyProfile"
          class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
          >Modifier le profil</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "WelcomeCard",
  props: [
    "avatarUrl",
    "userName",
    "createdAt",
    "followersNumber",
    "followingNumber",
    "postsNumber",
  ],
};
</script>

<style></style>
