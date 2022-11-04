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
            <form
              class="card card-body border-0"
              @submit.prevent="createPost()"
            >
              <div class="d-flex mb-3 border-bottom pb-2">
                <div class="img-sm-container me-3">
                  <img
                    class="mw-100 shadow rounded-3"
                    :src="auth.user.imageUrl"
                    alt="avatar"
                  />
                </div>
                <div class="w-100 form-group">
                  <textarea
                    v-model="newPost.message"
                    id="post"
                    name="post"
                    class="form-control border-0 p-2"
                    placeholder="When I woke up this morning..."
                    rows="2"
                  ></textarea>
                  <div
                    v-if="loadMessage"
                    class="alert alert-secondary"
                    role="alert"
                  >
                    {{ loadMessage }}
                  </div>
                </div>
              </div>
              <ul class="nav d-flex justify-content-around">
                <li class="nav-item">
                  <label type="button" for="formFile">
                    <i class="fa-regular fa-image fa-2x"></i>
                    <input
                      @change="selectImage"
                      type="file"
                      class="form-control"
                      name="image"
                      id="formFile"
                      accept="image/*"
                      hidden
                    />
                  </label>
                </li>
                <li class="nav-item">
                  <button type="submit" class="btn">
                    <i class="fa-regular fa-paper-plane fa-2x"></i>
                  </button>
                </li>
              </ul>
            </form>
          </section>
          <section id="feeds" class="shadow rounded-3 mb-3 p-3">
            <h2 class="text-start fs-4 fw-bolder">Fil d'actualité</h2>
            <Post :posts="posts" @getPosts="getPosts" @deletePost="deletePost" />
              <div v-if="isLoading === true">
                <Loader />
              </div>
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
import Loader from "@/components/Loader.vue";
import { useAuthStore } from "../stores/authStore";
import { postServices } from "../_services";
export default {
  name: "Home",
  components: {
    Post,
    MostPopular,
    Loader
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  data() {
    return {
      posts: [],
      lastPage: 1,
      newPost: {
        imageUrl: "",
        message: "",
      },
      loadMessage: "",
      showModal: false,
      modalTitle: "Publication",
      isLoading: false
    };
  },
  computed: {
    // formates the user account's creation date
    formattedDate() {
      return this.$filters.formatDate(this.auth.user.createdAt);
    },
  },
  methods: {
  
    //display the posts from one page;
    // called once for the page 1 at mounted lifecycle hook, then the next page every time 
    //the scroll reaches the visibility observer at the bottom of the page
    getPosts(page) {
      if (page > this.lastPage) { return };
      this.isLoading = true;
      postServices
        .getPosts(page)
        .then((res) => {
          this.posts.push(...res.data.posts);
          this.lastPage = res.data.totalPages;
          this.isLoading = false;
        })
        .catch((err) => console.log(err));
    },

    // selects image for new post
    selectImage(event) {
      this.newPost.imageUrl = event.target.files[0];
      this.loadMessage = "";
    },
    // creates a new post
    createPost() {
      let formData = new FormData();
      //throw an error if neither message nor image posted
      if (this.newPost.message == "" && this.newPost.imageUrl == "") {
        this.loadMessage = "Veuillez saisir un message ou choisir une photo";
      } else {
        //throw an error if the message is too long (over 1500 letters)
        if (this.newPost.message.length > 1500) {
          this.loadMessage = "Le message ne doit pas dépasser 1500 mots";
        } else {
          formData.append("message", this.newPost.message);
        }
        if (this.newPost.imageUrl) {
          //throw an error if the image size is too important (over 500ko)
          if (this.newPost.imageUrl.size > 500000) {
            this.loadMessage =
              "Attention, la taille de l'image ne doit pas dépasser 500ko";
          } else {
            formData.append("image", this.newPost.imageUrl);
          }
        }
        postServices
          .createPost(formData)
          .then(async (res) => {
            console.log(res);
            await this.posts.unshift(res.data);
            this.newPost = "";
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    //deletes one post
    deletePost(postId) {
      if (confirm("Cette publication sera supprimée définitivement. Etes-vous sûr(e) de vouloir continuer ?") == true) {
        postServices.deletePost(postId)
          .then(() => {
            this.posts = Object.values(this.posts).filter(elt => elt._id !== postId);
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
  },
  mounted() {
    this.getPosts(1);
  },
};
</script>

<style scoped>
.fa-image:hover,
.fa-paper-plane:hover {
  color: #fd2d01;
}
</style>
