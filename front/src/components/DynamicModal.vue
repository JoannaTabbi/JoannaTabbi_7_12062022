<template>
  <Transition name="myModal">
    <div v-if="show" class="modal-mask" @click.self="closeModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" :class="theme">
          <div class="modal-body text-start">
            <slot name="modalBody"></slot>
          </div>
          <div class="modal-footer border-top-0">
            <button
              v-if="reset"
              type="button"
              class="btn btn-outline-dark"
              @click="closeModal"
            >
              {{ dismissModalText }}
            </button>
            <button
              v-if="submit"
              type="button"
              class="btn btn-outline-dark"
              @click="submitModal"
            >
              {{ submitModalText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "DynamicModal",
  props: [
    "show",
    "modalTitle",
    "dismissModalText",
    "submitModalText",
    "reset",
    "submit",
    "theme",
  ],
  methods: {
    submitModal() {
      this.$emit("submitted");
    },
    closeModal() {
      this.$emit("closed");
    },
  },
};
</script>

<style>
.modal-dialog {
  border-radius: 10px;
  transition: all 0.3s ease;
}
.modal-mask {
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
}
.modal-content {
  max-width: 450px;
  margin: 0 auto;
}
.modal-content.success {
  background-color: white;
  color: #023b19;
}
.modal-content.warning {
  background: white;
  color: #fd2d01;
}

/* transition styling */
.myModal-enter-from,
.myModal-leave-to {
  opacity: 0;
}

.myModal-enter-from .modal-dialog,
.myModal-leave-to .modal-dialog {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  opacity: 0;
}
</style>