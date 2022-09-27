<template>
  <div class="card w-100 container p-0 mt-3">
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
        class="avatar col-6 col-sm-3 col-lg-2 ms-0 ms-lg-3 mb-3 mb-lg-0 position-relative"
      >
        <img
          :src="auth.user.imageUrl"
          class="img-fluid rounded-circle border border-white border-3 shadow"
          alt="mon avatar"
        />
        <label
          class="btn btn-dark bg-gradient rounded-3 position-absolute top-100 start-100 translate-middle"
        >
          <i class="fa-solid fa-camera fa-lg"></i
          ><input type="file" class="form-control" hidden />
        </label>
      </div>
      <div class="d-flex col-12 col-lg-9">
        <div class="col-6 mt-3 mt-lg-0">
          <button
            class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
            data-bs-toggle="modal"
            data-bs-target="#deleteProfileAlert"
          >
            Exporter mes données
          </button>
        </div>
        <div class="col-6 mt-3 mt-lg-0">
          <button
            class="btn btn-outline-danger py-2 px-3 rounded-pill shadow"
            data-bs-toggle="modal"
            data-bs-target="#deleteProfileAlert"
          >
            Supprimer le profil
          </button>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mx-2 mx-sm-5">
        <div class="col-12 border-bottom border-dark mb-5">
          <h1 class="fs-4 text-center">Modifiez le profil</h1>
        </div>
        <DynamicForm
          :schema="formSchema"
          submit-message="Je m'inscris"
          :modify-profile="true"
          :submit-function="onSubmit"
          :initial-values="this.userUpdate"
        />
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="deleteProfileAlert"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="deleteProfileAlertLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-primary" id="deleteProfileAlertLabel">
              <i class="fa-solid fa-triangle-exclamation fa-lg"></i>
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Votre profil sera supprimé définitivement. Etes-vous sûr(e) de
            vouloir continuer ?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-dark"
              data-bs-dismiss="modal"
            >
              Abandonner
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-dismiss="modal"
              @click="deleteMyProfile"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import DynamicForm from "@/components/DynamicForm";
import * as yup from "yup";
import { userServices } from "@/_services";
import router from "@/router/index";

export default {
  name: "modifyProfile",
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  data() {
    const formSchema = {
      fields: [
        {
          label: "PSEUDO",
          name: "userName",
          as: "input",
          type: "text",
          id: "userName",
          rules: yup
            .string()
            .min(
              3,
              "Le nom de l'utilisateur doit contenir au moins 3 caractères"
            )
            .matches(
              /^\S*$/,
              "Le mot de passe ne doit pas contenir des espaces blancs"
            ),
        },
        {
          label: "A PROPOS...",
          name: "aboutMe",
          as: "textarea",
          type: "text",
          id: "aboutMe",
          rows: "3",
          rules: yup.string(),
        },
        {
          label: "EMAIL",
          name: "email",
          as: "input",
          type: "email",
          id: "email",
          rules: yup.string().email("L'email n'est pas valide"),
        },
        {
          label: "MOT DE PASSE",
          name: "password",
          as: "input",
          type: "password",
          ref: "password",
          id: "password",
          rules: yup
            .string()
            .min(8, "Le mot de passe doit contenir au moins 8 caractères")
            .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
              "Le mot de passe doit contenir au moins une majuscule, une minuscule et un nombre"
            )
            .matches(
              /^\S*$/,
              "Le mot de passe ne doit pas contenir des espaces blancs"
            ),
        },
        {
          label: "CONFIRMEZ LE MOT DE PASSE",
          name: "confirmPassword",
          as: "input",
          type: "password",
          id: "confirmPassword",
          rules: yup
            .string()
            .required()
            .oneOf(
              [yup.ref("password"), null],
              "Le mot de passe ne correspond pas"
            ),
        },
      ],
    };
    return {
      formSchema,
      userUpdate: {
        aboutMe: this.auth.user.aboutMe,
        userName: this.auth.user.userName,
        email: this.auth.user.email,
        password: this.auth.user.password,
      },
    };
  },
  components: {
    DynamicForm,
  },
  methods: {
    // updates user's data
    onSubmit(value, actions) {
      // the new password will be submitted only if changed
      if (value.password === this.auth.user.password) {
        delete value.password;
      }

      // updates user's data on the server
      userServices
        .updateUser(value)
        .then((res) => {
          this.auth.user = res.data; // updates user in the store
          router.push("/myProfile");
        })

        .catch((err) => {
          console.log(err.codeName);
          actions.setFieldError("email", err);
        });
    },

    //deletes the user
    async deleteMyProfile() {
      // deletes the user's data from the server
      try {
        await userServices.deleteUser();

        // redirects user to the signup page
        await router.push("/signup");

        // throws away the user from pinia store
        this.auth.loggedOut();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped></style>
