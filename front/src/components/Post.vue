<template>
  <div>
    <article v-for="post in posts" :key="post._id">
      <div class="card card-body border-0 mb-3 px-0 p-sm-3">
        <span class="mx-5 border-top border-primary border-3"></span>
        <div
          class="d-flex align-items-center my-3 border-bottom border-top py-2"
        >
          <div class="d-flex img-sm-container me-2 align-items-center">
            <img
              class="mw-100 shadow rounded-3"
              :src="post.userId.imageUrl"
              alt="avatar"
            />
          </div>
          <div class="w-100 text-start">
            <router-link :to="auth.profilePage(post.userId._id)">
              <h3 class="fs-6 mb-0">"{{ post.userId.userName }}"</h3>
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
                  @click="updateToggle(post)"
                >
                  Modifier la publication
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
                  Supprimer la publication
                </div>
              </li>
              <li>
                <div
                  type="button"
                  v-if="post.userId._id != auth.user._id && auth.user.isAdmin === false"
                  class="dropdown-item"
                  @click="reportPost(post)"
                >
                  Signaler la publication
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- UPDATE POST SECTION -->

        <section v-if="post.isUpdating" class="shadow rounded-3 mb-3 p-3">
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
              </div>
            </div>
            <ul class="nav d-flex justify-content-around">
              <li class="nav-item">
                <div class="btn">
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
                </div>
              </li>
              <li class="nav-item">
                <button type="reset" class="btn" @click.prevent="updateToggle(post)">
                  <i class="fa-solid fa-xmark fa-2x text-danger"></i>
                </button>
                <button type="submit" class="btn">
                  <i class="fa-solid fa-check fa-2x text-success"></i>
                </button>
              </li>
            </ul>
          </form>
        </section>

        <!-- DISPLAY POST SECTION -->
        <section v-else>
          <div>
            <p class="text-start">
              {{ post.message }}
            </p>
          </div>
          <div
            v-if="post.imageUrl || post.imageUrl != ''"
            class="card-img mb-3"
          >
            <img class="w-100 rounded-3" :src="post.imageUrl" alt="image par default" />
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
        <Comments
          :comments="post.comments"
          v-model="newComment"
          @create-comment="createComment(post)"
          @delete-comment="deleteComment"
        />
      </div>
    </article>
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
import { useHandleErrorStore } from "@/stores/handleErrorStore";
import { postServices } from "../_services";
import { commentServices } from "../_services";
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
      updatedPost: {
        imageUrl: "",
        message: "",
      },
      newComment: ""
    };
  },
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return { auth, handleError };
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
        .catch((error) => this.handleError.triggerToast(error));
    },

    // for one post, toggles between updatePost section and display post section
    updateToggle(post) {
      post.isUpdating = !post.isUpdating;
    },

    // selects image for new post
    selectUpdateImage(event) {
      this.updatedPost.imageUrl = event.target.files[0];
    },

    //updates one post
    updatePost(post) {
      let formData = new FormData();
      if (this.updatedPost.message != "") {
        if (this.updatedPost.message.length > 1500) {
          this.handleError.triggerToast("Le message ne doit pas dépasser 1500 mots");
        } else {
          formData.append("message", this.updatedPost.message);
        }
      }
      if (this.updatedPost.imageUrl) {
        //throw an error if the image size is too important (over 500ko)
        if (this.updatedPost.imageUrl.size > 500000) {
          this.handleError.triggerToast("Attention, la taille de l'image ne doit pas dépasser 500ko");
        } else {
          formData.append("image", this.updatedPost.imageUrl);
        }
      }
      postServices
        .updatePost(post._id, formData)
        .then((res) => {
          post.message = res.data.message;
          post.imageUrl = res.data.imageUrl;
          this.updateToggle(post);
        })
        .catch((error) => this.handleError.triggerToast(error));
    },

    // emits delete post function for a postId given
    deletePost(postId) {
      this.$emit("delete-post", postId);
    },

    //reports post
    reportPost(post) {
        postServices.reportPost(post._id)
           .then(res => this.handleError.triggerToast("Votre signalement a bien été pris en compte"))
           .catch(error => this.handleError.triggerToast(error))
    },

    // create new comment to one post
    createComment(post) {
      commentServices
        .createComment({ message: this.newComment, postId: post._id })
        .then((res) => {
          post.comments.push(res.data);
          this.newComment = "";
        })
        .catch((error) => this.handleError.triggerToast(error));
    },

    // deletes one comment 
    deleteComment(commentId, postId) {
      commentServices.deleteComment(commentId)
      .then(() => {
         const postFound = this.posts.find(post => post._id == postId);
         postFound.comments = postFound.comments.filter(comment => comment._id != commentId);
      })
      .catch((error) => this.handleError.triggerToast(error))
    } 
  },
};
</script>

<style>
</style>
