<template>
  <div class="card card-body border-0">
    <div class="d-flex mb-3 border-bottom pb-2">
      <div class="img-sm-container me-3">
        <img
          class="mw-100 shadow rounded-3"
          src="../assets/avatar-200.png"
          alt="avatar"
        />
      </div>
      <form class="w-100">
        <textarea
          class="form-control border-0 p-2"
          placeholder="When I woke up this morning..."
          rows="2"
        ></textarea>
      </form>
    </div>
    <ul class="nav d-flex justify-content-around">
      <li class="nav-item">
        <label
          type="button"
        >
          <i class="fa-regular fa-image fa-2x"></i>
          <input type="file" class="form-control" hidden />
        </label>
      </li>
      <li class="nav-item">
        <a href="" type="button">
          <i class="fa-regular fa-paper-plane fa-2x"></i
        ></a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.fa-image:hover {
    color: #FD2D01;
}
</style>
