<template>
  <div class="vh-100 bg-image">
    <div class="connexion container py-4 bg-secondary h-100">
      <div class="row px-2 px-sm-5 h-100">
        <div class="col-12 border-bottom border-dark">
          <img
            class="d-flex"
            src="../assets/logos/icon-left-font-monochrome-black.png"
            alt="logo Groupomania"
          />
          <h1 class="fs-4 text-center">Page d'inscription</h1>
        </div>
        <div class="col-12 mt-5 mb-4">
          <form class="form" @submit.prevent="register">
            <div class="row mb-3 align-items-center justify-content-between">
              <label for="inputUserName" class="col-2 col-form-label"
                ><i
                  class="fa-regular fa-user border border-3 border-dark rounded-3 p-2"
                ></i
              ></label>
              <div class="col-10">
                <input
                  type="text"
                  class="form-control"
                  id="inputUserName"
                  placeholder="Jean_0814"
                  v-model.trim="user.userName"
                />
              </div>
            </div>
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
                  v-model.trim="user.email"
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
                  v-model.trim="user.password"
                />
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-dark bg-gradient rounded-5 w-100 mt-4 text-white fw-bold"
            >
              Je m'inscris
            </button>
          </form>
        </div>
        <div class="col-12 mb-3">
          <p class="mb-0">J'ai déjà un compte</p>
          <router-link to="/login" class="text-dark fs-5 fw-bold"
            >Identifiez-vous</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
         return {
            user: { 
                userName:"",
                email:"",
                password:""
            }
         }
    },
    methods: {
       register() {
          axios.post(process.env.VUE_APP_API_URL + 'auth/signup', this.user)
          .then((res) => console.log(res))
          .catch((err) => console.log(err))
       }
    },
    mounted() {
    this.$emit("changeIsConnected", false)
  }
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
