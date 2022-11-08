<template>
  <div>
    <div v-if="show" class="modal__backdrop" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-dark">
              {{ modalTitle }}
            </h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body text-start" :class="theme">
            <slot name="modalBody"></slot>
          </div>
          <div class="modal-footer">
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
  </div>
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
}
.modal__backdrop {
  top: 0;
  left: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}
.modal-body.success {
  background-color: linear-gradient(#FFD7D7, #023b19);
  color: white;
}
.modal-body.warning {
  background: linear-gradient(#FFD7D7, #FD2D01);
  color: white;
}
</style>