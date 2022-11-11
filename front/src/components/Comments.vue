<template>
  <div class="ps-2 border-start">
    <div class="d-flex mb-3">
      <div class="img-sm-container me-2">
        <img
          class="mw-100 shadow rounded-3"
          :src="auth.user.imageUrl"
          :alt="`avatar de ${auth.user.userName}`"
        />
      </div>
      <form class="w-100 d-flex" @submit.prevent="submitNewComment">
        <label for="comment" aria-label="écrire un commentaire"></label>
        <textarea
          id="comment"
          name="comment"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          class="form-control border-0 p-2"
          placeholder="Qu'en dites-vous?"
          rows="1"
        ></textarea>
        <button type="submit" class="btn" aria-label="créer le commentaire">
          <i class="fa-regular fa-paper-plane fa-lg"></i>
        </button>
      </form>
    </div>

    <!-- User's comments area -->
    <div v-for="comment in comments" :key="comment._id" class="my-4">

      <!-- display one comment -->
      <div class="d-flex my-2 py-2">
        <div class="d-flex img-sm-container me-2 align-items-start">
          <img
            class="mw-100 shadow rounded-3"
            :src="comment.userId.imageUrl"
            alt="avatar"
          />
        </div>
        <div class="w-100">
          <div class="w-100 text-start bg-light rounded-3 p-2">
            <div class="d-flex align-items-baseline justify-content-between">
              <router-link :to="auth.profilePage(comment.userId._id)">
                <h4 class="fs-6 mb-0">{{ comment.userId.userName }}</h4>
              </router-link>
              <div class="dropdown fs-5 fw-bold">
                <div
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  ...
                </div>

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
                      @click="updateCommentToggle(comment)"
                    >
                      Modifier le commentaire
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
                      @click="
                        $emit('delete-comment', comment._id, comment.postId)
                      "
                    >
                      Supprimer le commentaire
                    </div>
                  </li>
                  <li>
                    <div
                      type="button"
                      v-if="
                        comment.userId._id !== auth.user._id &&
                        auth.user.isAdmin === false
                      "
                      class="dropdown-item"
                      @click="reportComment(comment)"
                    >
                      Signaler le commentaire
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <!-- update one comment -->
            <form
              v-if="comment.isUpdating"
              class="d-flex"
              @submit.prevent="updateComment(comment)"
            >
              <textarea
                class="form-control border-0"
                name="updateComment"
                id="updateComment"
                rows="2"
                v-model="updatedComment"
                :placeholder="comment.message"
              >
              </textarea>
              <button
                type="reset"
                class="btn text-danger"
                aria-label="réinitialiser les modifications du commentaire"
                @click="updateCommentToggle(comment)"
              >
                <i class="fa-solid fa-xmark fa-lg"></i>
              </button>
              <button type="submit" class="btn" aria-label="soumettre les modifications du commentaire">
                <i class="fa-solid fa-check fa-lg text-success"></i>
              </button>
            </form>
            <p v-else class="fs-6 mb-0">
              {{ comment.message }}
            </p>
          </div>
          <!-- likes for one comment -->
          <ul
            class="
              nav nav-divider
              small
              justify-content-between
              align-items-center
              px-2
              mt-1
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
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { useHandleErrorStore } from "@/stores/handleErrorStore";
import { commentServices } from "@/_services";
export default {
  name: "Comments",
  data() {
    return {
      updatedComment: "",
    };
  },
  props: ["comments", "modelValue"],
  emits: ["update:modelValue", "createComment", "deleteComment"],
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return { auth, handleError };
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
        .catch((error) => this.handleError.triggerToast(error));
    },

    // for one commment, toggles between display element and form
    updateCommentToggle(comment) {
      comment.isUpdating = !comment.isUpdating;
    },

    //updates one comment
    updateComment(comment) {
      commentServices
        .updateComment(comment._id, { message: this.updatedComment })
        .then((res) => {
          comment.message = res.data.message;
          this.updateCommentToggle(comment);
        })
        .catch((error) => this.handleError.triggerToast(error));
    },

    //reports comment
    reportComment(comment) {
      commentServices
        .reportComment(comment._id)
        .then(() =>
          this.handleError.triggerToast(
            "Votre signalement a bien été pris en compte"
          )
        )
        .catch((error) => this.handleError.triggerToast(error));
    },
  },
};
</script>
