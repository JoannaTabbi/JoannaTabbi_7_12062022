<template>
  <div class="card w-100 container p-0 mt-3">
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
          :src="user.imageUrl"
          class="img-fluid rounded-circle border border-white border-3 shadow"
          alt="mon avatar"
        />
        <label
          class="btn btn-dark bg-gradient rounded-3 position-absolute top-100 start-100 translate-middle"
        >
          <i class="fa-solid fa-camera fa-lg"></i
          ><input type="file" class="form-control" hidden />
        </label>
      </div>
      <div class="d-flex col-12 col-lg-9">
        <div class="col-6 mt-3 mt-lg-0">
          <button
            class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
            data-bs-toggle="modal"
            data-bs-target="#deleteProfileAlert"
          >
            Exporter mes données
          </button>
        </div>
        <div class="col-6 mt-3 mt-lg-0">
          <button
            class="btn btn-outline-danger py-2 px-3 rounded-pill shadow"
            data-bs-toggle="modal"
            data-bs-target="#deleteProfileAlert"
          >
            Supprimer le profil
          </button>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mx-2 mx-sm-5">
        <div class="col-12 border-bottom border-dark mb-5">
          <h1 class="fs-4 text-center">Modifiez le profil</h1>
        </div>
        <form class="form" @submit.prevent="submitProfileModif">
          <div class="row mb-3 align-items-center justify-content-between">
            <label
              for="inputAboutMe"
              class="form-label col-12 col-lg-2 text-start text-lg-end fw-bold"
              >A propos...</label
            >
            <div class="col-12 col-lg-10">
              <textarea
                class="form-control"
                id="inputAboutMe"
                rows="3"
                :placeholder="user.aboutMe"
              ></textarea>
            </div>
          </div>
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
                :placeholder="user.userName"
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
                :placeholder="user.email"
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
              <input type="password" class="form-control" id="inputPassword" />
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-dark bg-gradient rounded-5 w-100 mt-4 text-white fw-bold mb-3"
          >
            Modifiez
          </button>
        </form>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="deleteProfileAlert"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="deleteProfileAlertLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-primary" id="deleteProfileAlertLabel">
              <i class="fa-solid fa-triangle-exclamation fa-lg"></i>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Votre profil sera supprimé définitivement. Etes-vous sûr(e) de
            vouloir continuer ?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-dark"
              data-bs-dismiss="modal"
            >
              Abandonner
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-dismiss="modal"
              @click="deleteMyProfile"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/authStore";
import { mapState, mapActions } from "pinia";
import Axios from "@/interceptors/axios";
import router from "../router/index";

export default {
  name: "modifyProfile",
  computed: {
    ...mapState(useAuthStore, ['user']),
  },
  methods: {
    //...mapActions(useAuthStore, ["loggedOut"]),
    //deletes the user
    async deleteMyProfile() {
       try {
        // deletes the user's data from the server
        const res = await Axios.delete(process.env.VUE_APP_API_URL + "/auth")

        // throws away the user from pinia store
        const auth = useAuthStore();
        auth.loggedOut();

        // redirects user to the signup page
        router.push("/signup");
      } catch (err) {
        throw err;
      }
      /* // deletes the user's data from the server
      const res = Axios.delete(process.env.VUE_APP_API_URL + "/auth")
        .then(() => {
          //takes out the authorization bearer from response headers
          //Axios.defaults.headers.common["Authorization"] = "";

          // throws away the user from pinia store
          this.loggedOut();

          // redirects user to the signup page
          router.push("/signup");
        })
        .catch((err) => console.log(err)); */
    },
  },
};
</script>

<style scoped></style>
