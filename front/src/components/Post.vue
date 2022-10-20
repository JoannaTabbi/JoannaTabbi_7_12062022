<template>
  <div>
    <div v-for="post in posts" :key="post._id" class="card card-body border-0 m-0 p-3">
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
          <p class="mb-0 fw-light small fst-italic">{{ formattedDate(post.createdAt) }}</p>
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
              <div class="dropdown-item">Modifiez votre publication</div>
            </li>
            <li>
              <div class="dropdown-item">Supprimez votre publication</div>
            </li>
            <li>
              <div class="dropdown-item">Signalez cette publication</div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="post.imageUrl || post.imageUrl != ''" class="card-img mb-3">
        <img
          class="w-100"
          :src="post.imageUrl"
          alt="image par default"
        />
      </div>
      <div>
        <p class="text-start">
          {{ post.message }}
        </p>
      </div>
      <ul class="nav d-flex justify-content-start mb-4 small">
        <li class="nav-item me-3">
          <a href="">
            <i class="fa-solid fa-thumbs-up fa-lg"></i>
            J'aime
            <span>{{post.likes}}</span>
          </a>
        </li>
        <li class="nav-item">
          <a href="">
            <i class="fa-solid fa-comment fa-lg"></i>
            Commentaire(s)
            <span>{{post.comments.length}}</span>
          </a>
        </li>
      </ul>
      <!--  COMMENTS  -->
      <Comments />
    </div>
  <div v-if="posts.length" v-observe-visibility="handleInfiniteScroll"></div>  
  </div>
</template>

<script>
import Comments from "./Comments.vue";
import { useAuthStore } from "@/stores/authStore";
export default {
  name: "Post",
  components: {
    Comments,
  },
  props: {
        posts: {
          type: Array
        }},
  data() {
    return {
      page: 1
    } 
  },
  setup() {
    const auth = useAuthStore();
    return { auth }
  },
  methods: {
     // formates the the user account's creation date
    formattedDate(date) {
      return this.$filters.formatDate(date);
    },
    // isCurrentUserPost(id) {
    //   id == this.auth.user._id ? true : false
    // }
    
    //handles scroll to bottom
    handleInfiniteScroll(isVisible) {
      if (!isVisible) { return }
      this.page++
      this.$emit('getPosts', this.page)
    }
    
  }
}
</script>

<style>
</style>
>
