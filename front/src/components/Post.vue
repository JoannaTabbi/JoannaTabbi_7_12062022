<template>
  <div>
    <div v-for="post in posts" :key="post._id" :data-id="post._id">
      <div class="card card-body border-0 m-0 p-3">
        <span class="mx-5 border-top border-primary border-3"></span>
        <div
          class="d-flex align-items-center my-3 border-bottom border-top py-2"
        >
          <div class="d-flex img-sm-container me-3 align-items-center">
            <img
              class="mw-100 shadow rounded-3"
              :src="post.userId.imageUrl"
              alt="avatar"
            />
          </div>
          <div class="w-100 text-start">
            <router-link to="/profile">
              <h5 class="fs-6 mb-0">"{{ post.userId.userName }}"</h5>
            </router-link>
            <p class="mb-0 fw-light small fst-italic">
              {{ formattedDate(post.createdAt) }}
            </p>
          </div>
          <!-- dropdown menu -->
          <div class="dropdown fs-2">
            <a
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              ...
            </a>

            <ul
              class="dropdown-menu dropdown-menu-end text-end"
              aria-labelledby="dropdownMenuLink"
            >
              <li>
                <div
                  type="button"
                  v-if="
                    post.userId._id == auth.user._id ||
                    auth.user.isAdmin === true
                  "
                  class="dropdown-item"
                  @click="updateToggle"
                >
                  Modifiez la publication
                </div>
              </li>
              <li>
                <div
                  type="button"
                  v-if="
                    post.userId._id == auth.user._id ||
                    auth.user.isAdmin === true
                  "
                  class="dropdown-item"
                  @click="deletePost(post._id)"
                >
                  Supprimez la publication
                </div>
              </li>
              <li>
                <div
                  type="button"
                  v-if="post.userId._id != auth.user._id"
                  class="dropdown-item"
                >
                  Signalez la publication
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- UPDATE POST SECTION -->

          <section id="update_post" v-if="isUpdating" class="shadow rounded-3 mb-3 p-3">
            <form
              class="card card-body border-0"
              @submit.prevent="updatePost(post)"
            >
              <div class="d-flex mb-3 border-bottom pb-2">
                <div class="w-100 form-group">
                  <textarea
                    v-model="updatedPost.message"
                    id="updatePost"
                    name="updatePost"
                    class="form-control border-0 p-2"
                    :placeholder="post.message"
                    rows="2"
                  ></textarea>
                  <div
                    v-if="loadUpdateMessage"
                    class="alert alert-secondary"
                    role="alert"
                  >
                    {{ loadUpdateMessage }}
                  </div>
                </div>
              </div>
              <ul class="nav d-flex justify-content-around">
                <li class="nav-item">
                  <label type="button" for="formFile2">
                    <i class="fa-regular fa-image fa-2x"></i>
                    <input
                      @change="selectUpdateImage"
                      type="file"
                      class="form-control"
                      name="image"
                      id="formFile2"
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
                <li class="nav-item" @click.prevent="updateToggle">
                  <button type="reset" class="btn">
                    <i class="fa-regular fa-trash-can fa-2x"></i>
                  </button>

                </li>
              </ul>
            </form>
          </section>

        <!-- DISPLAY POST SECTION -->
        <section id="display_post" v-else>
          <div>
            <p class="text-start">
              {{ post.message }}
            </p>
          </div>
          <div
            v-if="post.imageUrl || post.imageUrl != ''"
            class="card-img mb-3"
          >
            <img class="w-100" :src="post.imageUrl" alt="image par default" />
          </div>
          <ul class="nav d-flex justify-content-start mb-4 small">
            <li
              class="nav-item me-3 pointer"
              :class="{ like: isLiked(post.usersLiked) }"
            >
              <div @click="likeToggle(post)">
                <i class="fa-solid fa-thumbs-up fa-lg"></i>
                J'aime
                <span v-if="post.likes">{{ post.likes }}</span>
              </div>
            </li>
            <li class="nav-item">
              <div>
                <i class="fa-solid fa-comment fa-lg"></i>
                Commentaire(s)
                <span>{{ post.comments.length }}</span>
              </div>
            </li>
          </ul>
        </section>

        <!--  COMMENTS  -->
        <Comments :comments="post.comments" />

        <!-- MODAL FOR UPDATE POST-->

        <!-- MODAL 
      <div v-if="showModal">
        <DynamicModal
          :modal-title="modalTitle"
          :modal-message="modalMessage"
          :dismiss-modal-text="dismissModalText"
          :submitModalText="submitModalText"
          @closed="toggledModal"
          @submitted="deletePost(post)"
          :reset="true"
          :submit="true"
          theme="warning"
        >
          <template v-slot:modalBody>
            <p>
              {{ modalMessage }}
            </p>
          </template>
        </DynamicModal>
      </div>   -->
      </div>
    </div>
    <div
      v-if="posts && posts.length"
      v-observe-visibility="handleInfiniteScroll"
    ></div>
  </div>
</template>

<script>
import Comments from "./Comments.vue";
import DynamicModal from "./DynamicModal.vue";
import { useAuthStore } from "@/stores/authStore";
import { postServices } from "../_services";
export default {
  name: "Post",
  components: {
    Comments,
    DynamicModal,
  },
  props: {
    posts: {
      type: Array,
    },
  },
  data() {
    return {
      page: 1,
      isUpdating: false,
      updatedPost: {
        imageUrl: "",
        message: ""
      },
      loadUpdateMessage: ""

      /* modal data : deletePost
      modalTitle: "ATTENTION",
      modalMessage:
        "Cette publication sera supprimée définitivement. Etes-vous sûr(e) de vouloir continuer ?",
      dismissModalText: "Abandonner",
      submitModalText: "Supprimer",
      showModal: false, */
    };
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  methods: {

    // formates the the user account's creation date
    formattedDate(date) {
      return this.$filters.formatDate(date);
    },

    //verifies if user has already liked this post. If true, adds like class to "j'aime"
    isLiked(usersLiked) {
      return usersLiked.some((user) => user._id == this.auth.user._id);
    },

    /* toggle modal
    toggledModal() {
      this.showModal = !this.showModal;
    }, */

    //handles scroll to bottom;
    //when visibility observer on the bottom of the page is visible,
    //the page is incremented and getPosts function called
    handleInfiniteScroll(isVisible) {
      if (!isVisible) {
        return;
      }
      this.page++;
      this.$emit("getPosts", this.page);
    },

    //likes or unlikes someone's post. Note that if the payload = "like": true,
    //the current user gives his like, if the payload = "like": false,
    //the user retrieves his like.
    likeToggle(post) {
      postServices
        .likePost(post._id, { like: !this.isLiked(post.usersLiked) })
        .then((res) => {
          post.usersLiked = res.data.usersLiked;
          post.likes = res.data.likes;
        })
        .catch((error) => console.log(error));
    },

    // for one post, toggles between updatePost section and display post section
    updateToggle() {
      this.isUpdating = !this.isUpdating;
    },
    
    // selects image for new post
    selectUpdateImage(event) {
      this.updatedPost.imageUrl = event.target.files[0];
      this.loadUpdateMessage = "";
    },

    //updates one post
    updatePost(post) {
       let formData = new FormData();
       if(this.updatedPost.message != "") {
         if (this.updatedPost.message.length > 1500) {
          this.loadUpdateMessage = "Le message ne doit pas dépasser 1500 mots";
        } else {
          formData.append("message", this.updatedPost.message);
        };
       }
        if (this.updatedPost.imageUrl) {
          //throw an error if the image size is too important (over 500ko)
          if (this.updatedPost.imageUrl.size > 500000) {
            this.loadUpdateMessage =
              "Attention, la taille de l'image ne doit pas dépasser 500ko";
          } else {
            formData.append("image", this.updatedPost.imageUrl);
          }
        }
        postServices.updatePost(post._id, formData)
          .then((res) => {
            console.log(res.data);
            post.message = res.data.message;
            post.imageUrl = res.data.imageUrl;
            this.updateToggle();
          })
          .catch((error) => console.log(error))
    },

    // emits delete post function for a postId given
    deletePost(postId) {
      this.$emit("delete-post", postId);
    },

    
  },
};
</script>

<style>
</style>
