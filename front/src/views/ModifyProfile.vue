<template>
  <div>
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
          class="
            avatar
            col-6 col-sm-3 col-lg-2
            ms-0 ms-lg-3
            mb-3 mb-lg-0
            position-relative
          "
        >
          <img
            :src="auth.user.imageUrl"
            class="img-fluid rounded-circle border border-white border-3 shadow"
            alt="mon avatar"
          />
          <label
            class="
              btn btn-dark
              bg-gradient
              rounded-3
              position-absolute
              top-100
              start-100
              translate-middle
            "
          >
            <i class="fa-solid fa-camera fa-lg"></i
            ><input type="file" class="form-control" hidden />
          </label>
        </div>
        <div class="d-flex col-12 col-lg-9">
          <div class="col-6 mt-3 mt-lg-0">
            <button class="btn btn-outline-dark py-2 px-3 rounded-pill shadow">
              Exporter mes données
            </button>
          </div>
          <div class="col-6 mt-3 mt-lg-0">
            <button
              class="btn btn-outline-danger py-2 px-3 rounded-pill shadow"
              @click="toggledModal"
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
            submit-message="Modifier"
            :reset="true"
            :submit-function="onSubmit"
            :initial-values="this.userUpdate"
          />
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="showModal">
      <DynamicModal
        :modal-title="modalTitle"
        :modal-message="modalMessage"
        :dismiss-modal-text="dismissModalText"
        :submitModalText="submitModalText"
        @closed="toggledModal"
        @submitted="deleteMyProfile"
        :reset="true"
        :submit="true"
      >
        <template v-slot:modalBody>
          <p>
            {{ modalMessage }}
          </p>
        </template>
      </DynamicModal>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import DynamicForm from "@/components/DynamicForm";
import DynamicModal from "@/components/DynamicModal";
import * as Yup from "yup";
import { userServices } from "@/_services";
import router from "@/router/index";

export default {
  name: "modifyProfile",
  setup() {
    const auth = useAuthStore();
    return { auth };
  },
  data() {
    // define attributs and verification rules for each input of the form
    const formSchema = {
      fields: [
        {
          label: "PSEUDO",
          name: "userName",
          as: "input",
          type: "text",
          id: "userName",
          rules: Yup.string()
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
          rules: Yup.string(),
        },
        {
          label: "EMAIL",
          name: "email",
          as: "input",
          type: "email",
          id: "email",
          rules: Yup.string().email("L'email n'est pas valide"),
        },
        {
          label: "MOT DE PASSE",
          name: "password",
          as: "input",
          type: "password",
          ref: "password",
          id: "password",
          rules: Yup.string()
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
          rules: Yup.string()
            .required()
            .test(
              "confirmation",
              "Les mots de passe ne correspondent pas",
              (value) => password.value === value
            ),
        },
      ],
    };
    return {
      formSchema,
      modalTitle: "ATTENTION",
      modalMessage:
        "Votre profil sera supprimé définitivement. Etes-vous sûr(e) de vouloir continuer ?",
      dismissModalText: "Abandonner",
      submitModalText: "Supprimer",
      showModal: false,
      userUpdate: this.auth.user,
    };
  },
  components: {
    DynamicForm,
    DynamicModal,
  },
  methods: {
    // toggle modal
    toggledModal() {
      this.showModal = !this.showModal;
    },

    // updates user's data
    onSubmit(value) {
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
          console.log(err);
        });
    },

    //deletes the user
    async deleteMyProfile() {
      // deletes the user's data from the server
      try {
        await userServices.deleteUser();

        this.toggledModal();

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
