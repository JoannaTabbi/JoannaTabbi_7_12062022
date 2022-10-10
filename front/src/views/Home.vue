<template>
  <main class="h-100">
    <div class="container-fluid">
      <div class="row">
        <!-- WELCOME CARD SECTION -->

        <div class="col-12 col-lg-3 mb-3 pt-3">
          <section id="home" class="shadow rounded-3 mb-3 p-3">
            <h1 class="text-start fs-3">Accueil</h1>
            <div
              class="card w-100 flex-sm-row flex-lg-column align-items-center"
            >
              <div class="p-5 p-sm-3 p-lg-5">
                <img
                  :src="auth.user.imageUrl"
                  class="
                    img-fluid
                    card-img-top
                    shadow
                    border border-white border-3
                    rounded-circle
                  "
                  alt="mon avatar"
                />
              </div>

              <div class="card-body">
                <h5 class="card-title">
                  Bonjour
                  <span
                    ><router-link to="/myProfile">{{
                      auth.user.userName
                    }}</router-link></span
                  >
                </h5>

                <small class="card-text"
                  >Membre depuis le
                  <div>{{ formattedDate }}</div></small
                >
              </div>
              <ul class="list-group list-group-flush small">
                <li
                  class="
                    list-group-item
                    d-flex
                    flex-wrap
                    align-items-center
                    justify-content-between
                  "
                >
                  <router-link to="/myProfile" class="fw-bold text-dark me-2">
                    <span>{{ auth.followersNb }}</span>
                    <span class="ms-1">Vous suivent</span>
                  </router-link>
                  <router-link to="/myProfile" class="fw-bold text-dark">
                    <span>{{ auth.followingNb }}</span>
                    <span class="ms-1">Suivis</span>
                  </router-link>
                </li>
                <li class="list-group-item">
                  <router-link to="/myProfile" class="fw-bold text-dark">
                    <span>{{ postsNumber }}</span>
                    <span class="ms-1">Publications</span>
                  </router-link>
                </li>

                <li
                  class="
                    list-group-item
                    d-flex
                    flex-wrap
                    align-items-center
                    justify-content-evenly
                  "
                >
                  <router-link
                    to="/modifyProfile"
                    class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
                    >Modifier le profil</router-link
                  >
                </li>
              </ul>
            </div>
          </section>
        </div>

        <!-- WELCOME CARD SECTION END -->
        <!-- FEEDS AND CREATE POST SECTIONS -->

        <div
          class="h-100 col-12 col-md-8 col-lg-6 pt-3 border-start border-end"
        >
          <section id="create_post" class="shadow rounded-3 mb-3 p-3">
            <h2 class="text-start fs-4">Créez une publication</h2>
            <form @submit.prevent="addPost" class="card card-body border-0">
              <div class="d-flex mb-3 border-bottom pb-2">
                <div class="img-sm-container me-3">
                  <img
                    class="mw-100 shadow rounded-3"
                    :src="auth.user.imageUrl"
                    alt="avatar"
                  />
                </div>
                <div class="w-100">
                  <textarea v-model="post.message"
                    class="form-control border-0 p-2"
                    placeholder="When I woke up this morning..."
                    rows="2"
                  ></textarea>
                  <div v-if="message" class="alert alert-secondary" role="alert">{{loadMessage}}</div>
                </div>
              </div>
              <ul class="nav d-flex justify-content-around">
                <li class="nav-item">
                  <label type="button">
                    <i class="fa-regular fa-image fa-2x"></i>
                    <input @change="selectImage" type="file" class="form-control" hidden />
                  </label>
                </li>
                <li class="nav-item">
                  <button type="submit">
                    <i class="fa-regular fa-paper-plane fa-2x"></i
                  ></button>
                </li>
              </ul>
            </form>
          </section>
          <section id="feeds" class="shadow rounded-3 mb-3 p-3">
            <h2 class="text-start fs-4 fw-bolder">Fil d'actualité</h2>
            <Post />
          </section>
        </div>

        <!-- FEEDS AND CREATE POST SECTIONS END -->
        <!-- MOST POPULAR SECTION -->

        <div class="col-12 col-md-4 col-lg-3 pt-3">
          <MostPopular />
        </div>

        <!-- MOST POPULAR SECTION END -->
      </div>
    </div>
  </main>
</template>

<script>
import Post from "../components/Post.vue";
import MostPopular from "../components/MostPopular.vue";
import { useAuthStore } from "../stores/authStore";
import { postServices } from "../_services";
export default {
  name: "Home",
  components: {
    Post,
    MostPopular,
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  data() {
    return {
       post: {
         userId: this.auth.user._id,
         imageUrl: "",
         message: ""
       },
       currentImage: undefined,
       loadMessage: "",
    }
  },
  computed: {
    // formates the the user account's creation date
    formattedDate() {
      return this.$filters.formatDate(this.auth.user.createdAt);
    },
  },
  methods: {
    // create new post
    selectImage(event) {
      this.currentImage = event.target.files[0];
      this.loadMessage = "";
    },

    addPost() {
      
      let formData = new FormData();
      formData.append("post", this.post.message);
      formData.append("image", this.currentImage);
  
      postServices.createPost(formData)
        .then((res) => { 
          console.log(res);
        })
        .catch((err) => {
          this.loadMessage = "L'image n'a pas pu être changée! " + err;
          this.currentImage = undefined;
        });
    },

  }
};
</script>

<style scoped>
.fa-image:hover, .fa-paper-plane:hover {
    color: #FD2D01;
}
</style>
