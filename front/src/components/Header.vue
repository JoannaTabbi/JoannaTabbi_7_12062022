<template>
  <header>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light mb-3 border-bottom border-primary border-4 fixed-top"
    >
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img
            src="../assets/logos/icon-left-font-monochrome-black-rect.png"
            alt="logo Groupomania"
            class="img-fluid"
          />
        </a>
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
              <a class="nav-link active" aria-current="page" href="#"
                ><i class="fa-solid fa-house fs-2 fa-fw mx-2"></i>
                <span class="d-lg-none">Accueil</span>
              </a>
            </li>
            <li class="nav-item text-start">
              <a class="nav-link" href="#"
                ><i class="fa-solid fa-bell fs-2 fa-fw mx-2"></i>
                <span class="d-lg-none"> Notifications</span>
              </a>
            </li>
            <li class="nav-item text-start dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                ><i class="fa-solid fa-user fs-2 fa-fw mx-2"></i>
                <span class="d-lg-none">Vous</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#">Voir le profil</a></li>
                <li>
                  <a class="dropdown-item" href="#">Modifier le profil</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">Changer le mot de passe</a>
                </li>
              </ul>
            </li>
            <li class="nav-item text-start">
              <a class="nav-link" href="#"
                ><i
                  class="fa-solid fa-arrow-right-from-bracket fs-2 fa-fw mx-2"
                ></i>
                <span class="d-lg-none">Se déconnecter</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 180px;
}
</style>
