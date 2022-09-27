<template>
  <Form class="form" @submit="submitFunction"
          :initial-values="initialValues">
    <div class="mb-2 text-start" v-for="{ as, name, label, ...attrs } in schema.fields" :key="name">
      <label 
        class="col-form-label px-2"
        :for="name">{{ label }}</label>
      <Field
        class="form-control"
        :as="as" 
        :id="name" 
        :name="name" 
        v-bind="attrs"
      />
      <ErrorMessage 
        class="px-2" 
        as="small" 
        :name="name" />
    </div>
    <!-- reset -->

    <button
              type="reset"
              class="col-5 btn btn-danger bg-gradient rounded-5 mt-4 text-white fw-bold mb-3"
              v-if="modifyProfile"
            >
              Réinitialisez
            </button>
    <!-- submit -->

    <button
      type="submit"
      class="btn btn-dark bg-gradient rounded-5 w-100 mt-4 text-white fw-bold"
    >
      {{ submitMessage }}
    </button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
export default {
  name: "DynamicForm",
  components: {
    Form,
    Field,
    ErrorMessage
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    submitMessage: {
      type: String
    },
    submitFunction: {
      type: Function
    },
    modifyProfile: {
      type: Boolean
    },
    initialValues: {
      type: Object
    }
  },

};
</script>

<style></style>
