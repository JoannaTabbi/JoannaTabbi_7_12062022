<template>
  <footer class="fixed-bottom bg-dark border-top border-primary border-4 py-3">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-12 col-lg-4 text-lg-start">
            <h3 class="fs-5 fw-bold">Infos</h3>
            <ul class="list-unstyled">
                <li class="list-item"><router-link to="">Mentions légales</router-link></li>
                <li class="list-item"><router-link to="">Confidentialité</router-link></li>
                <li class="list-item"><router-link to="">Gestion de cookies</router-link></li>
            </ul>
        </div>
        <div class="col-12 col-lg-4 text-lg-start">
            <h3 class="fs-5 fw-bold">Assistance</h3>
            <ul class="list-unstyled">
                <li class="list-item"><router-link to="">Centre d'aide</router-link></li>
                <li class="list-item"><router-link to="">Accessibilité</router-link></li>
                <li class="list-item"><a href="mailto:contact@groupomania.com">Nous contacter</a></li>
            </ul>
        </div>
        <div class="col-12 col-lg-4 text-lg-start">
          <router-link to="/" class="navbar-brand">
            <img
              src="../assets/logos/icon-left-font-monochrome-white-rect.png"
              alt="logo Groupomania"
              class="img-fluid"
            />
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
    color: white
}
a {
    color: inherit;
    text-decoration: none;
}
img {
  width: 150px;
}
</style>
