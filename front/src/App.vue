<template>
  <div>
    <!-- if isConnected is false, the header will not be injected to the page -->
     <Header v-if="isConnected"/> 
    <router-view v-on:changeIsConnected="changeIsConnected"> </router-view>
    <!-- <Footer /> -->
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      isConnected: true
    }
  },
  // depending on isConnected = true or false, some action will be executed
  methods: {
    changeIsConnected(boolean) {
      this.isConnected = boolean
    }
  }
};
</script>

<style>
#app {
  font-family: Lato, "Open sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #4e5166;
}
.bg-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('https://picsum.photos/800/1200?random=1&grayscale');
}
.img-sm-container {
  width: 50px;
}
img {  
  object-fit: cover;
}  
h1, h2, h5 {
  font-weight: bold;
}
a {
  text-decoration: none;
  color: #4e5166;
}
a:hover {
  color: #FD2D01;
}
.form-control:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
}
input:focus, textarea:focus {
  background-image: radial-gradient(ellipse at 40% 50%, #ffebeb 30%, #fff 80%);
}
</style>
