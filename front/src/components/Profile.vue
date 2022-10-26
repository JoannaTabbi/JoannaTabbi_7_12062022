<template>
  <section id="profile" class="shadow rounded-3 bg-white mb-3">
    <div class="card w-100 container p-0">
      <div class="row">
        <div class="col-12">
          <img
            class="img-fluid w-100 rounded-top"
            src="https://picsum.photos/800/200?random=1&grayscale"
            alt="photo aléatoire"
          />
        </div>
      </div>
      <div class="row d-flex flex-column flex-lg-row mb-3 align-items-center">
        <div
          class="
            main-avatar-container
            col-6 col-sm-3 col-lg-2
            ms-0 ms-lg-3
            mb-3 mb-lg-0
          "
        >
          <img
            :src="user.imageUrl"
            alt="mon avatar"
          />
        </div>
        <div
          class="
            col-12 col-lg-4
            d-flex
            flex-column
            align-items-lg-start
            justify-content-end
            mb-3 mb-lg-0
          "
        >
          <h1 class="card-title fs-5 mb-0">{{ user.userName }}</h1>
          <p class="card-text small">
            Membre depuis le <span>{{ formattedDate }}</span>
          </p>
        </div>
        <div
            v-if="userProfile"
            class="
              w-25 btn btn-outline-dark rounded-pill shadow
            "
            @click="submitFollow"
          >{{ followButtonText }}
            
          </div>
        <div v-if="userProfile" class="col-lg-1 dropdown">
          <a
            href="#"
            role="button"
            id="dropdownMenuLink"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            class="fs-3"
          >
            ...
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuLink"
          >
            <li>
              <a class="dropdown-item" href="#">Signaler cet utilisateur</a>
            </li>
          </ul>
        </div>
        <ul
          v-if="!userProfile"
          class="nav col-lg-4 justify-content-center align-items-center ms-auto"
        >
          <li class="nav-item">
            <router-link
              to="/modifyProfile"
              class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
              >Modifier le profil</router-link
            >
          </li>
        </ul>
      </div>
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="posts-tab"
            data-bs-toggle="tab"
            data-bs-target="#posts"
            type="button"
            role="tab"
            aria-controls="posts"
            aria-selected="false"
            
          >
            Publications
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="about-tab"
            data-bs-toggle="tab"
            data-bs-target="#about"
            type="button"
            role="tab"
            aria-controls="about"
            aria-selected="true"
          >
            A propos
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="followers-tab"
            data-bs-toggle="tab"
            data-bs-target="#followers"
            type="button"
            role="tab"
            aria-controls="followers"
            aria-selected="true"
          >
            Vous suivent
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="following-tab"
            data-bs-toggle="tab"
            data-bs-target="#following"
            type="button"
            role="tab"
            aria-controls="following"
            aria-selected="false"
          >
            Suivis
          </button>
        </li>
      </ul>
      <div class="tab-content m-4 text-start" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="posts"
          role="tabpanel"
          aria-labelledby="posts-tab"
        >
          <Post :posts="posts" @getPosts="getUserPosts"/>
          <div v-if="isLoading === true">
            <Loader />
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="about"
          role="tabpanel"
          aria-labelledby="about-tab"
        >
          {{ user.aboutMe }}
        </div>
        <div
          class="tab-pane fade"
          id="followers"
          role="tabpanel"
          aria-labelledby="followers-tab"
        >
          <div class="container">
            <div class="row g-3">
              <MiniProfile :mpUsers="user.followers" />
            </div>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="following"
          role="tabpanel"
          aria-labelledby="following-tab"
        >
          <div class="container">
            <div class="row g-3">
              <MiniProfile :mpUsers="user.following" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Post from "@/components/Post.vue";
import MiniProfile from "@/components/MiniProfileCard";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/stores/authStore";
import { postServices } from "@/_services";
export default {
  name: "Profile",
  components: {
    Post,
    MiniProfile,
    Loader
  },
  props: {
    user: {
        type: Object
    }, 
    userProfile: {
        type: Boolean
    }, 
    followButtonText: {
        type: String
    }
  },
  data() {
     return {
        posts: [], 
        lastPage: 1,
        isLoading: false
     }
  },
  setup() {
    const auth = useAuthStore();
    return { auth }
  },
  computed: {
    // formates the the user account's creation date
    formattedDate() {
      return this.$filters.formatDate(this.user.createdAt);
    },
  },
  methods: {
    submitFollow() {
        this.$emit("submitFollow");
    },

    //display the posts from one page;
    // displays the first page of posts when clicked on "publication" tag, then the next page every time 
    //the scroll reaches the visibility observer at the bottom of the page till the last page
    getUserPosts(page) {
        //stops fetching data when the last page is displayed
      if (page > this.lastPage) { return };
      this.isLoading = true;
      postServices
        .getUserPosts(page, {postUser: this.user._id || this.$route.params.id})
        .then((res) => {
          this.posts.push(...res.data.userPosts);
          this.lastPage = res.data.totalPages;
          this.isLoading = false;
        })
        .catch((err) => console.log(err));
    }
  },
  mounted() {
    this.getUserPosts(1)
  }
};

</script>

<style>
.main-avatar-container {
  margin-top: -5%;
  margin-left: 30px;
  width: 150px;
  height: 150px;
  overflow: hidden;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 3px 3px 15px lightgrey;
}
.main-avatar-container img {
    object-fit: contain;
    object-position: 50% 50%;
}
</style>