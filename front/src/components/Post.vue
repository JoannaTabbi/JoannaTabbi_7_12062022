<template>
  <div class="card card-body border-0 m-0 p-3">
    <span class="mx-5 border-top border-primary border-3"></span>
    <div class="d-flex my-3 border-bottom border-top py-2">
      <div class="d-flex img-sm-container me-3 align-items-center">
        <img
          class="mw-100 shadow rounded-3"
          src="../assets/avatar-200.png"
          alt="avatar"
        />
      </div>
      <div class="w-100 text-start">
        <h5 class="fs-6 mb-0">Jean_Dupont</h5>
        <p class="fs-6 mb-0 fw-light fst-italic">13 juillet 2022 à 16:04</p>
      </div>
    </div>
    <div class="card-img mb-3">
      <img
        class="w-100"
        src="https://picsum.photos/500/250?random=1"
        alt="image par default"
      />
    </div>
    <div>
      <p class="text-start">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, quas.
        Blanditiis possimus quasi, illo officia quaerat facere cupiditate nihil
        ea ab porro, pariatur quibusdam unde provident vero perferendis minus
        non et architecto illum deleniti autem repellendus! Dignissimos sint
        nostrum aliquam odit rerum, hic corporis animi provident magni, quam
        architecto autem delectus numquam blanditiis iste.
      </p>
    </div>
    <ul class="nav d-flex justify-content-start mb-4">
      <li class="nav-item me-3">
        <a href="">
          <i class="fa-solid fa-thumbs-up fa-lg"></i>
          J'aime
          <span>(3)</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="">
          <i class="fa-solid fa-comment fa-lg"></i>
          Commentaire(s)
          <span>(5)</span>
        </a>
      </li>
    </ul>
    <!--  COMMENTS  -->
    <div class="ps-4 border-start">
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
            placeholder="Qu'en dites-vous?"
            rows="1"
          ></textarea>
        </form>
      </div>
      <div class="my-4 border">Comments</div>
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
</style>
>