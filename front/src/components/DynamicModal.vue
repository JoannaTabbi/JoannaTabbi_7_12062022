<template>
  <div class="modal__backdrop" @click.self="closeModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-primary" id="deleteProfileAlertLabel">
            {{ modalTitle }}
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body text-start">
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
            class="btn btn-outline-danger"
            @click="submitModal"
          >
            {{ submitModalText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DynamicModal",
  props: ["modalTitle", "dismissModalText", "submitModalText", "reset", "submit"],
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
.modal__dialog {
  width: 400px;
  padding: 20px;
  margin: 100px auto;
  background: white;
  border-radius: 10px;
}
.modal__backdrop {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
}
</style>