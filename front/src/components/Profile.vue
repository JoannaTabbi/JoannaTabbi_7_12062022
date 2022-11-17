<template>
  <section id="profile" class="shadow rounded-sm-3 bg-white mb-3">
    <div class="card w-100 container-fluid p-0">
      <div class="row">
        <div class="col-12">
          <img
            class="img-fluid w-100 rounded-top-sm-3"
            src="https://picsum.photos/800/200?random=1&grayscale"
            alt="photo aléatoire"
          />
        </div>
      </div>
      <div
        class="
          row
          mb-5
          align-items-center
          justify-content-center justify-content-md-evenly
        "
      >
        <div
          class="
            avatar-container-round avatar-profile avatar-lg
            col-12 col-md-3 col-lg-2
            mx-0 mx-lg-3
            mb-3 mb-lg-0
            p-0
          "
        >
          <img :src="user.imageUrl" :alt="`avatar de ${user.userName}`" />
        </div>
        <div
          class="
            col-12 col-md-5
            d-flex
            flex-column
            align-items-md-start
            justify-content-center
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
            col-12 col-md-3
            d-flex
            flex-column flex-md-row
            align-items-center
            justify-content-center
          "
        >
          <div>
            <div
              class="btn btn-outline-dark rounded-pill shadow me-0 me-md-4"
              @click="submitFollow"
            >
              {{ followButtonText }}
            </div>
          </div>
          <div class="dropdown">
            <div
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              class="fs-3"
            >
              ...
            </div>
          </div>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuLink"
          >
            <li>
              <div class="dropdown-item" @click="reportUser">
                Signaler cet utilisateur
              </div>
            </li>
          </ul>
        </div>
        <ul
          v-if="!userProfile"
          class="
            nav
            col-12 col-md-3
            justify-content-center
            align-items-center
            pe-0
          "
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

      <!--  TABS  -->

      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <!--  POSTS TAB  -->
        <li class="nav-item pointer" role="presentation">
          <div
            class="nav-link active"
            id="posts-tab"
            data-bs-toggle="tab"
            data-bs-target="#posts"
            role="tab"
            aria-controls="posts"
            aria-selected="false"
          ><h2 class="fs-6 mb-0">Publications</h2>
            
          </div>
        </li>

        <!--  ABOUT ME TAB  -->
        <li class="nav-item pointer" role="presentation">
          <div
            class="nav-link"
            id="about-tab"
            data-bs-toggle="tab"
            data-bs-target="#about"
            role="tab"
            aria-controls="about"
            aria-selected="true"
          ><h2 class="fs-6 mb-0">A propos</h2>
          </div>
        </li>

        <!--  FOLLOWERS TAB  -->
        <li class="nav-item pointer" role="presentation">
          <div
            class="nav-link"
            id="followers-tab"
            data-bs-toggle="tab"
            data-bs-target="#followers"
            role="tab"
            aria-controls="followers"
            aria-selected="true"
          ><h2 class="fs-6 mb-0">Vous suivent</h2>
          </div>
        </li>

        <!--  FOLLOWING TAB  -->
        <li class="nav-item pointer" role="presentation">
          <div
            class="nav-link"
            id="following-tab"
            data-bs-toggle="tab"
            data-bs-target="#following"
            role="tab"
            aria-controls="following"
            aria-selected="false"
          ><h2 class="fs-6 mb-0">Suivis</h2>
          </div>
        </li>
      </ul>

      <!--  TABS CONTENT  -->
      <div class="tab-content m-4 text-start pt-3" id="myTabContent">
        <!--  POSTS TAB CONTENT  -->
        <div
          class="tab-pane fade show active"
          id="posts"
          role="tabpanel"
          aria-labelledby="posts-tab"
        >
          <Post :posts="posts" @get-posts="getUserPosts" @delete-post="deletePost" />
          <div v-if="isLoading === true">
            <Loader />
          </div>
        </div>

        <!--  ABOUT ME TAB CONTENT  -->
        <div
          class="tab-pane fade"
          id="about"
          role="tabpanel"
          aria-labelledby="about-tab"
        >
          {{ user.aboutMe }}
        </div>

        <!--  FOLLOWERS TAB CONTENT  -->
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

        <!--  FOLLOWING TAB CONTENT  -->
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
import MiniProfile from "@/components/MiniProfile";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/stores/authStore";
import { useHandleErrorStore } from "@/stores/handleErrorStore";
import { postServices } from "@/_services";
import { userServices } from "@/_services";
export default {
  name: "Profile",
  components: {
    Post,
    MiniProfile,
    Loader,
  },
  props: {
    user: {
      type: Object,
    },
    userProfile: {
      type: Boolean,
    },
    followButtonText: {
      type: String,
    },
  },
  data() {
    return {
      posts: [],
      lastPage: 1,
      isLoading: false,
    };
  },
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return { auth, handleError };
  },
  computed: {
    // formates the the user account's creation date
    formattedDate() {
      return this.$filters.formatDate(this.user.createdAt);
    },
  },
  methods: {
    // emits submit following / unfollowing function
    submitFollow() {
      this.$emit("submitFollow");
    },

    //display the posts from one page;
    // displays the first page of posts when clicked on "publication" tag, then the next page every time
    //the scroll reaches the visibility observer at the bottom of the page till the last page
    getUserPosts(page) {
      //stops fetching data when the last page is displayed
      if (page > this.lastPage) {
        return;
      }
      this.isLoading = true;
      postServices
        .getUserPosts(page, {
          postUser: this.user._id || this.$route.params.id,
        })
        .then((res) => {
          this.posts.push(...res.data.userPosts);
          this.lastPage = res.data.totalPages;
          this.isLoading = false;
        })
        .catch((error) => this.handleError.triggerToast(error));
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
    
    //reports user
    reportUser() {
      userServices
        .reportUser(this.user._id)
        .then(() =>
          this.handleError.triggerToast(
            "Votre signalement a bien été pris en compte"
          )
        )
        .catch((error) => this.handleError.triggerToast(error));
    },
  },
  mounted() {
    // calls fetching all users data on mounted lifecycle
    this.getUserPosts(1);
  },
};
</script>

<style>
.avatar-profile {
  margin-top: -5%;
}
</style>