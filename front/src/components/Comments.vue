<template>
  <div class="ps-4 border-start">
    <div class="d-flex mb-3 border-bottom pb-2">
      <div class="img-sm-container me-3">
        <img
          class="mw-100 shadow rounded-3"
          :src="auth.user.imageUrl"
          :alt="`avatar de ${auth.user.userName}`"
        />
      </div>
      <form class="w-100 d-flex" @submit.prevent="submitNewComment">
        <textarea
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="form-control border-0 p-2"
          placeholder="Qu'en dites-vous?"
          rows="1"
        ></textarea>
        <button type="submit" class="btn">
          <i class="fa-regular fa-paper-plane fa-lg"></i>
        </button>
      </form>
    </div>

    <!-- User's comments area -->
    <div v-for="comment in comments" :key="comment._id" class="my-4">
      <!-- one comment -->
      <div class="d-flex my-2 py-2">
        <div class="d-flex img-sm-container me-3 align-items-start">
          <img
            class="mw-100 shadow rounded-3"
            :src="comment.userId.imageUrl"
            alt="avatar"
          />
        </div>
        <div>
          <div class="w-100 text-start bg-light rounded-3 p-2">
            <div class="d-flex align-items-baseline justify-content-between">
              <div>
                <h5 class="fs-6 mb-0">{{ comment.userId.userName }}</h5>
              </div>
              <div class="dropdown fs-5 fw-bold">
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
                        comment.userId._id === auth.user._id ||
                        auth.user.isAdmin
                      "
                      class="dropdown-item"
                      href="#"
                    >
                      Modifiez le commentaire
                    </div>
                  </li>
                  <li>
                    <div
                      type="button"
                      v-if="
                        comment.userId._id === auth.user._id ||
                        auth.user.isAdmin
                      "
                      class="dropdown-item"
                      href="#"
                      @click="$emit('delete-comment', comment._id, comment.postId)"
                    >
                      Supprimez le commentaire
                    </div>
                  </li>
                  <li>
                    <div
                      type="button"
                      v-if="
                        comment.userId._id !== auth.user._id ||
                        auth.user.isAdmin
                      "
                      class="dropdown-item"
                      href="#"
                    >
                      Signalez le commentaire
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <p class="fs-6 mb-0">
              {{ comment.message }}
            </p>
          </div>
          <ul
            class="
              nav nav-divider
              small
              justify-content-between
              align-items-center
              px-2
            "
            :class="{ like: isLiked(comment.usersLiked) }"
          >
            <li class="nav-item pointer" @click="likeToggle(comment)">
              <div>J'aime</div>
            </li>
            <li class="nav-item">
              <div class="p-1 d-flex align-items-baseline">
                <span v-if="comment.likes" class="me-2">{{
                  comment.likes
                }}</span>
                <i class="fa-solid fa-thumbs-up fa-lg"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- one comment end -->
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { commentServices } from "@/_services";
export default {
  name: "Comments",
  props: ["comments", "modelValue"],
  emits: ["update:modelValue", "createComment", "deleteComment"],
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  methods: {
    // emits create comment
    submitNewComment() {
      this.$emit("createComment");
    },

    //adds "like" class to "j'aime" if current user liked the comment
    isLiked(usersLiked) {
      return usersLiked.some((user) => user == this.auth.user._id);
    },

    //likes or unlikes someone's post. Note that if the payload = "like": true,
    //the current user gives his like, if the payload = "like": false,
    //the user retrieves his like.
    likeToggle(comment) {
      commentServices
        .likeComment(comment._id, { like: !this.isLiked(comment.usersLiked) })
        .then((res) => {
          comment.usersLiked = res.data.usersLiked;
          comment.likes = res.data.likes;
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style></style>
