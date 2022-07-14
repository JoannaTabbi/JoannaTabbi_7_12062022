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
        <a
          href=""
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i class="fa-regular fa-image fa-2x"></i>
        </a>
      </li>
      <li class="nav-item">
        <a href="" type="button">
          <i class="fa-regular fa-paper-plane fa-2x"></i
        ></a>
      </li>
    </ul>
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Photo</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="mb-3">
                <label for="formFile" class="form-label text-start"
                  ><i class="fa-regular fa-image fa-2x"></i
                ></label>
                <input class="form-control" type="file" id="formFile" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Fermer
            </button>
            <button type="button" class="btn btn-light bg-gradient">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.form-control:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
}
textarea[placeholder]:focus {
  background-image: radial-gradient(ellipse at 40% 50%, #ffebeb 30%, #fff 80%);
}
.fa-image {
  color: #f84aa7;
}
.fa-paper-plane {
  color: #9677bb;
}
</style>
