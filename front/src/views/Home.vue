<template>
  <main class="h-100 main-content">
    <div class="container-fluid">
      <div class="row">
        <!-- WELCOME CARD SECTION -->

        <div class="col-12 col-md-4 mb-3 pt-3">
          <section id="home" class="shadow rounded-3 mb-3 p-3 sticky-md-top">
            <h1 class="text-start fs-3">Accueil</h1>
            <div
              class="card w-100 flex-sm-row flex-md-column align-items-center"
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

              <div class="card-body my-4">
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
                <div
                  class="
                    mt-3
                  "
                >
                  <router-link
                    to="/modifyProfile"
                    class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
                    >Modifier le profil</router-link
                  >
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- WELCOME CARD SECTION END -->
        <!-- FEEDS AND CREATE POST SECTIONS -->

        <div
          class="h-100 col-12 col-md-8 pt-3 border-start border-end"
        >
          <section id="create_post" class="shadow rounded-3 mb-3 p-3">
            <h2 class="text-start fs-4">Créer une publication</h2>
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
                </div>
              </div>
              <ul class="nav d-flex justify-content-around">
                <li class="nav-item">
                  <div class="btn">
                    <label type="button" for="formFile3">
                    <i class="fa-regular fa-image fa-2x"></i>
                    <input
                      @change="selectImage"
                      type="file"
                      class="form-control"
                      name="image"
                      id="formFile3"
                      accept="image/*"
                      hidden
                    />
                  </label>
                  </div>
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
            <Post
              :posts="posts"
              @getPosts="getPosts"
              @deletePost="deletePost"
            />
            <div v-if="isLoading === true">
              <Loader />
            </div>
          </section>
        </div>

        <!-- FEEDS AND CREATE POST SECTIONS END -->

      </div>
    </div>
  </main>
</template>

<script>
import Post from "../components/Post.vue";
import Loader from "@/components/Loader.vue";
import { useAuthStore } from "../stores/authStore";
import { useHandleErrorStore } from "../stores/handleErrorStore";
import { postServices } from "../_services";
export default {
  name: "Home",
  components: {
    Post,
    Loader
  },
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return {
      auth, handleError
    };
  },
  data() {
    return {
      posts: [],
      lastPage: 1,
      newPost: {
        imageUrl: "",
        message: "",
      },
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
      if (page > this.lastPage) {
        return;
      }
      this.isLoading = true;
      postServices
        .getPosts(page)
        .then((res) => {
          this.posts.push(...res.data.posts);
          this.lastPage = res.data.totalPages;
          this.isLoading = false;
        })
        .catch((err) => {
          this.handleError.triggerToast(`Une erreur est survenue : ${err}`)
        });
    },

    // selects image for new post
    selectImage(event) {
      this.newPost.imageUrl = event.target.files[0];
    },
    // creates a new post
    createPost() {
      let formData = new FormData();
      //throw an error if neither message nor image posted
      if (this.newPost.message == "" && this.newPost.imageUrl == "") {
        this.handleError.triggerToast("Veuillez saisir un message ou choisir une photo");
      } else {
        //throw an error if the message is too long (over 1500 letters)
        if (this.newPost.message.length > 1500) {
          this.handleError.triggerToast("Le message ne doit pas dépasser 1500 mots");
        } else {
          formData.append("message", this.newPost.message);
        }
        if (this.newPost.imageUrl) {
          //throw an error if the image size is too important (over 500ko)
          if (this.newPost.imageUrl.size > 500000) {
            this.handleError.triggerToast("Attention, la taille de l'image ne doit pas dépasser 500ko");
          } else {
            formData.append("image", this.newPost.imageUrl);
          }
        }
        postServices
          .createPost(formData)
          .then(async (res) => {
            await this.posts.unshift(res.data);
            this.newPost = "";
          })
          .catch((err) => this.handleError.triggerToast(err));
      }
    },

    //deletes one post
    deletePost(postId) {
      if (
        confirm(
          "Cette publication sera supprimée définitivement. Etes-vous sûr(e) de vouloir continuer ?"
        ) == true
      ) {
        postServices
          .deletePost(postId)
          .then(() => {
            this.posts = Object.values(this.posts).filter(
              (elt) => elt._id !== postId
            );
          })
          .catch((err) => {
            this.handleError.triggerToast(err);
          });
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
