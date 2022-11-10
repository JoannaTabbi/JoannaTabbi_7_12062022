<template>
  <Form class="form" @submit="submitFunction" :initial-values="initialValues">
    <div
      class="mb-2 text-start"
      v-for="{ as, name, label, ...attrs } in schema.fields"
      :key="name"
    >
      <label class="col-form-label px-2" :for="name">{{ label }}</label>
      <Field
        class="form-control"
        :as="as"
        :id="name"
        :name="name"
        v-bind="attrs"
      />
      <ErrorMessage class="px-2" as="small" :name="name" />
    </div>
    <div>
       <!-- reset -->
      <button
      type="reset"
      class="btn btn-danger bg-gradient rounded-5 m-3 text-white fw-bold"
      v-if="reset"
    >
      {{ resetMessage }}
    </button>
    <!-- submit -->

    <button
      type="submit"
      class="btn btn-dark bg-gradient rounded-5 m-3 text-white fw-bold"
    >
      {{ submitMessage }}
    </button>
    </div>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  name: "DynamicForm",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    submitMessage: {
      type: String,
    },
    resetMessage: {
      type: String,
    },
    submitFunction: {
      type: Function,
    },
    reset: {
      type: Boolean,
    },
    initialValues: {
      type: Object,
    },
  },
};
</script>

<style></style>
