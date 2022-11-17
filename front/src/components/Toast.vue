<template>
  <div class="toast-wrapper">
    <div class="toast-content">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  props: ["toastMessage"],
};
</script>

<style>
.toast-wrapper {
  position: fixed;
  width: 100%;
  top: 100px;
}
.toast-content {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  color: white;
  background: linear-gradient(#E42701, #AD1D01, #E42701);
  border-radius: 10px;
  box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.2);
}
/* enter transitions */
.toast-enter-from {
  opacity: 0;
  transform: translateY(-60px);
}

.toast-enter-active {
  transition: all 0.3s ease;
}
/* leave transitions */

.toast-leave-to {
  opacity: 0;
  transform: translateY(-60px);
}
.toast-leave-active {
  transition: all 0.3s ease;
}
</style>