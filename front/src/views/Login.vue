<template>
  <div class="vh-100 bg-image">
    <div class="connexion container py-4 bg-secondary h-100">
      <div class="row px-2 px-sm-5 h-100">
        <div class="col-12 border-bottom border-dark">
          <img
            class="d-flex mb-5"
            src="../assets/logos/icon-left-font-monochrome-black-rect.png"
            alt="logo Groupomania"
          />
          <h1 class="fs-4 text-center">Page de connexion</h1>
        </div>
        <div class="col-12 mt-5 mb-4">
          <form class="form">
            <div class="row mb-3 align-items-center justify-content-between">
              <label for="inputEmail" class="col-2 col-form-label"
                ><i
                  class="fa-solid fa-at border border-3 border-dark rounded-3 p-2"
                ></i
              ></label>
              <div class="col-10">
                <input
                  type="email"
                  class="form-control"
                  id="inputEmail"
                  placeholder="jean.dupond@exemple.fr"
                />
              </div>
            </div>
            <div class="row mb-3 align-items-center justify-content-between">
              <label for="inputPassword" class="col-2 col-form-label"
                ><i
                  class="fa-solid fa-lock border border-3 border-dark rounded-3 p-2"
                ></i
              ></label>
              <div class="col-10">
                <input
                  type="password"
                  class="form-control"
                  id="inputPassword"
                />
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-dark bg-gradient rounded-5 w-100 mt-4 text-white fw-bold"
            >
              Connexion
            </button>
          </form>
        </div>
        <div class="col-12 mb-3">
          <p class="mb-0">Pas encore inscrit ?</p>
          <router-link to="/signup" class="text-dark fs-5 fw-bold"
            >Créez votre compte</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // sets the value of isConnected to false in order to not show the header on the login page
  mounted() {
    this.$emit("changeIsConnected", false);
  },
};
</script>

<style scoped>
img {
  width: 200px;
}
.connexion {
  width: 100%;
  max-width: 576px;
}
</style>
