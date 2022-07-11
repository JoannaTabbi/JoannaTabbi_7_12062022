<template>
  <div>
     <Header /> 
    <router-view> </router-view>
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
</style>
