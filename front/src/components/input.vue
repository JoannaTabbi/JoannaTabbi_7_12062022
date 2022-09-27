<template>
  <div class="row mb-3 align-items-center justify-content-between">
    <label for="inputEmail" class="col-2 col-form-label"
      ><i class="fa-solid fa-at border border-3 border-dark rounded-3 p-2"></i
    ></label>
    <div class="col-10">
      <Field
        type="email"
        class="form-control"
        id="inputEmail"
        name="inputEmail"
        placeholder="jean.dupond@exemple.fr"
        v-model="user.email"
      />
      <ErrorMessage name="inputEmail" as="small" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
