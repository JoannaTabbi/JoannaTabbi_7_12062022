<template>
  <header>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light border-bottom border-primary border-4"
    >
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">
          <img
            src="../assets/logos/icon-left-font-transparent-rect.png"
            alt="logo Groupomania"
            class="img-fluid"
          />
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarToggler"
          aria-controls="navbarToggler"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="collapse navbar-collapse justify-content-end"
          id="navbarToggler"
        >
          <form class="d-flex me-2">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Votre recherche"
              aria-label="Search"
            />
            <button class="btn" type="submit">
              <i class="fa-solid fa-magnifying-glass fs-2"></i>
            </button>
          </form>
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li class="nav-item text-start">
              <router-link to="/" class="nav-link active" aria-current="page"
                ><i class="fa-solid fa-house fa-fw fs-2 mx-2"></i>
                <span class="d-lg-none">Accueil</span>
              </router-link>
            </li>
            <li class="nav-item text-start dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ><i class="fa-solid fa-user fa-fw fs-2 text-dark mx-2"></i>
                <span class="d-lg-none">{{ userName }}</span>
              </a>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <li>
                  <router-link to="/myProfile" class="dropdown-item"
                    >Voir le profil</router-link
                  >
                </li>
                <li>
                  <router-link to="/modifyProfile" class="dropdown-item"
                    >Modifier le profil</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item text-start">
              <router-link to="/login" class="nav-link" @click.prevent="logout"
                ><i
                  class="fa-solid fa-arrow-right-from-bracket fa-fw fs-2 text-dark mx-2"
                ></i>
                <span class="d-lg-none">Se déconnecter</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import axios from "@/_interceptors/axios.js";
import router from "../router/index";
import { useAuthStore } from "../stores/authStore";
export default {
  name: "Header",
  props: ['userName'],
  methods: {
    async logout() {
      try {
        // fetching logout route
        const res = await axios.get(
          process.env.VUE_APP_API_URL + "/auth/logout",
          {},
          { withCredentials: true }
        );

        // throws away the user from pinia store
        const auth = useAuthStore();
        auth.loggedOut();

        // redirects user to the login page
        router.push("/login");
      } catch (err) {
        throw err;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 200px;
}
</style>
