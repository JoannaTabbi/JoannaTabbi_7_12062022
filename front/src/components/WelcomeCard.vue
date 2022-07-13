<template>
  <div class="card w-100 flex-sm-row flex-lg-column align-items-center">
    <div class="p-5 p-sm-3 p-lg-5">
      <img
        src="../assets/avatar-200.png"
        class="img-fluid card-img-top shadow rounded-circle"
        alt="mon avatar"
      />
    </div>

    <div class="card-body">
      <h5 class="card-title">Bonjour, Joanna</h5>
      <p class="card-text">Membre depuis le <span>12 juillet 2022</span></p>
    </div>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item d-flex flex-wrap align-items-center justify-content-evenly"
      >
        <a href="" class="fw-bold text-dark">
          <span>3</span>
          <span class="ms-1">Followers</span>
        </a>
        <a href="" class="fw-bold text-dark">
            <span>4</span>
            <span class="ms-1">Following</span>
            </a>
      </li>
      <li class="list-group-item"><a href="" class="fw-bold text-dark">
            <span>6</span>
            <span class="ms-1">Posts</span>
            </a></li>

      <li
        class="list-group-item d-flex flex-wrap align-items-center justify-content-evenly"
      ><router-link to="/modifyProfile" class="card-link bg-secondary bg-gradient text-black py-2 px-3 rounded-pill shadow">Modifier le profil</router-link></li>      
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
