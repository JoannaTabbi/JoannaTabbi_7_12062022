<template>
  <main class="h-100 min-vh-100 bg-dark">
    <div class="container-fluid main-content px-0 px-sm-3 main-padding-top">
      <div class="row">
        <!-- WELCOME CARD SECTION -->

        <div class="col-12 col-md-4 pt-3">
          <aside
            id="home"
            class="bg-borders shadow rounded-sm-3 p-3 sticky-md-top"
          >
            <h1 class="text-start fs-3">Accueil</h1>
            <div
              class="
                card
                w-100
                pt-5 pt-sm-0
                ps-sm-5
                pt-md-5
                ps-md-0
                flex-sm-row flex-md-column
                align-items-center
              "
            >
              <div class="avatar-container-round avatar-lg">
                <img :src="auth.user.imageUrl" :alt="`image de ${auth.user.userName}`" />
              </div>

              <div class="card-body my-4">
                <h2 class="card-title fs-5">
                  Bonjour
                  <span
                    ><router-link to="/myProfile">{{
                      auth.user.userName
                    }}</router-link></span
                  >
                </h2>
                <small class="card-text"
                  >Membre depuis le
                  <div>{{ formattedDate }}</div></small
                >
                <div class="mt-3">
                  <router-link
                    to="/modifyProfile"
                    class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
                    >Modifier le profil</router-link
                  >
                </div>
              </div>
            </div>
          </aside>
        </div>

        <!-- FEEDS AND CREATE POST SECTIONS -->

        <div class="h-100 col-12 col-md-8 pt-3">
          <!-- CREATE POST SECTION -->
          <section
            id="create_post"
            class="bg-borders shadow rounded-sm-3 mb-3 p-3"
          >
            <h2 class="text-start fs-4">Créer une publication</h2>
            <form
              class="card card-body border-0 px-2 px-sm-3"
              @submit.prevent="createPost()"
            >
              <div class="d-flex mb-3 border-bottom pb-2">
                <div class="img-sm-container me-2">
                  <img
                    class="mw-100 shadow rounded-3"
                    :src="auth.user.imageUrl"
                    :alt="`avatar de ${auth.user.userName}`"
                  />
                </div>
                <div class="w-100 form-group">
                  <label for="post" aria-label="écrire une publication" class="visuallyhidden">Ecrire une publication</label>
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
                    <label type="button" for="newPostFormFile">
                      <span class="visuallyhidden">Choisir une nouvelle image</span>
                      <i class="fa-regular fa-image fa-2x"></i>
                      <input
                        @change="selectImage"
                        type="file"
                        class="form-control"
                        name="image"
                        id="newPostFormFile"
                        accept="image/*"
                        hidden
                      />
                    </label>
                  </div>
                </li>
                <li class="nav-item">
                  <button type="submit" class="btn" aria-label="soumettre une publication">
                    <i class="fa-regular fa-paper-plane fa-2x"></i>
                  </button>
                </li>
              </ul>
            </form>
          </section>

          <!-- FEEDS SECTION -->
          <section id="feeds" class="shadow bg-borders rounded-sm-3 mb-3 p-3">
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
    Loader,
  },
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return {
      auth,
      handleError,
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
      isLoading: false,
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
          this.handleError.triggerToast(`Une erreur est survenue : ${err}`);
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
        this.handleError.triggerToast(
          "Veuillez saisir un message ou choisir une photo"
        );
      } else {
        //throw an error if the message is too long (over 1500 letters)
        if (this.newPost.message.length > 1500) {
          this.handleError.triggerToast(
            "Le message ne doit pas dépasser 1500 mots"
          );
        } else {
          formData.append("message", this.newPost.message);
        }
        if (this.newPost.imageUrl) {
          //throw an error if the image size is too important (over 500ko)
          if (this.newPost.imageUrl.size > 500000) {
            this.handleError.triggerToast(
              "Attention, la taille de l'image ne doit pas dépasser 500ko"
            );
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

<style>
.fa-image:hover,
.fa-paper-plane:hover {
  color: #fd2d01;
}
#home {
  position: sticky;
  top: 80px;
}
.bg-clear {
  background: rgba(255, 215, 215, 0.2);
}
.bg-borders {
  background: rgba(255, 255, 255, 0.7);
}
</style>
