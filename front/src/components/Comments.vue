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
      <form class="w-100">
        <textarea
          class="form-control border-0 p-2"
          placeholder="Qu'en dites-vous?"
          rows="1"
        ></textarea>
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
                    <div class="dropdown-item" href="#">
                      Modifiez votre commentaire
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item" href="#">
                      Supprimez votre commentaire
                    </div>
                  </li>
                  <li>
                    <div class="dropdown-item" href="#">
                      Signalez ce commentaire
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
          >
            <li class="nav-item pointer" @click="likeToggle(comment)">
              <div href="">J'aime</div>
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
  props: {
    comments: {
      type: Array,
    },
  },
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  methods: {
    //likes or unlikes someone's post. Note that if the payload = "like": true,
    //the current user gives his like, if the payload = "like": false,
    //the user retrieves his like.
    likeToggle(comment) {
      const commentArr = Object.values(comment.usersLiked);
      const found = commentArr.some((elt) => elt._id == this.auth.user._id);

      commentServices
        .likeComment(comment._id, { like: !found })
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
