<template>
  <Form class="form" @submit="submitFunction">
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
      required: true,
    },
    submitMessage: {
      type: String
    },
    submitFunction: {
      type: Function
    }
  },

};
</script>

<style></style>
