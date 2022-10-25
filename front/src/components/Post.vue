<template>
  <div>
    <div v-for="post in posts"
      :key="post._id">
    <div class="card card-body border-0 m-0 p-3">
      <span class="mx-5 border-top border-primary border-3"></span>
      <div class="d-flex align-items-center my-3 border-bottom border-top py-2">
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
                v-if="post.userId._id == auth.user._id || auth.user.isAdmin === true"
                class="dropdown-item"
              >
                Modifiez la publication
              </div>
            </li>
            <li>
              <div
                type="button"
                v-if="post.userId._id == auth.user._id || auth.user.isAdmin === true"
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
      <div v-if="post.imageUrl || post.imageUrl != ''" class="card-img mb-3">
        <img class="w-100" :src="post.imageUrl" alt="image par default" />
      </div>
      <div>
        <p class="text-start">
          {{ post.message }}
        </p>
      </div>
      <ul class="nav d-flex justify-content-start mb-4 small">
        <li class="nav-item me-3 pointer">
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

      <!--  COMMENTS  -->
      <Comments :comments="post.comments" />
      <!-- MODAL -->
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
      </div>
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

      //modal data
      modalTitle: "ATTENTION",
      modalMessage:
        "Cette publication sera supprimée définitivement. Etes-vous sûr(e) de vouloir continuer ?",
      dismissModalText: "Abandonner",
      submitModalText: "Supprimer",
      showModal: false,
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

    // toggle modal
    toggledModal() {
      this.showModal = !this.showModal;
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
      const postArr = Object.values(post.usersLiked);
      const found = postArr.some((elt) => elt._id == this.auth.user._id);

      postServices
        .likePost(post._id, { like: !found })
        .then((res) => {
          post.usersLiked = res.data.usersLiked;
          post.likes = res.data.likes;
        })
        .catch((error) => console.log(error));
    },

    //deletes one post
    deletePost(postId) {
      console.log(postId);
        postServices.deletePost(postId)
          .then(() => {
            console.log(this.posts);
            const postsArr = Object.values(this.posts);
            this.posts = postsArr.filter(elt => elt._id !== postId);
            this.posts = Object.fromEntries(this.posts);
            
           // this.toggledModal;
          })
          .catch((error) => {
            console.log(error)
          })
      
    },
  },
};
</script>

<style>
</style>
