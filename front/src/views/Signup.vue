<template>
  <main>
    <div class="vh-100 bg-connexion">
      <div class="connexion container py-4 bg-secondary h-100">
        <div class="row px-2 px-sm-5 h-100">
          <div class="col-12 border-bottom border-dark">
            <img
              class="d-flex mb-2 logo"
              src="../assets/logos/icon-left-font-monochrome-black-rect.png"
              alt="logo Groupomania"
            />
            <h1 class="fs-4 text-center">Page d'inscription</h1>
          </div>
          <div class="col-12 mt-2 mb-2">
            <DynamicForm
              :schema="formSchema"
              submit-message="Je m'inscris"
              :submit-function="register"
            />
          </div>
          <div class="col-12 mb-3">
            <p class="mb-0">J'ai déjà un compte</p>
            <router-link to="/login" class="text-dark fs-5 fw-bold"
              >Identifiez-vous</router-link
            >
          </div>
        </div>
      </div>
    </div>

    <DynamicModal
      :show="showModal"
      :modal-title="modalTitle"
      submit-modal-text="Fermer"
      @submitted="redirectToLogin"
      @closed="redirectToLogin"
      :submit="true"
      :theme="theme"
    >
      <template v-slot:modalBody>
        <p>
          {{ modalMessage }}
        </p>
      </template>
    </DynamicModal>
  </main>
</template>

<script>
import { authServices } from "@/_services";
import DynamicForm from "@/components/DynamicForm";
import DynamicModal from "@/components/DynamicModal";
import * as Yup from "yup";
import router from "../router/index";
export default {
  data() {
    /* defines inputs properties and validation rules for signup form */
    const formSchema = {
      fields: [
        {
          label: "PSEUDO",
          name: "userName",
          as: "input",
          type: "text",
          id: "userName",
          placeholder: "Jean74",
          rules: Yup.string()
            .required("Ce champs est obligatoire")
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
          label: "EMAIL",
          name: "email",
          as: "input",
          type: "email",
          id: "email",
          placeholder: "jean.dupond@exemple.fr",
          rules: Yup.string()
            .required("L'email est obligatoire")
            .email("L'email n'est pas valide"),
        },
        {
          label: "MOT DE PASSE",
          name: "password",
          as: "input",
          type: "password",
          ref: "password",
          id: "password",
          rules: Yup.string()
            .required()
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
      showModal: false,
      formSchema,
      theme: "",
      modalTitle: "",
      modalMessage: "",
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

    // redirect user to the login page
    redirectToLogin() {
      if (this.theme === "success") {
        router.push("/login");
      } else {
        this.toggledModal();
      }
    },

    //register the new user in the database
    register(value) {
      authServices
        .signupUser(value)
        .then(() => {
          (this.theme = "success"),
            (this.modalTitle = "FELICITATIONS !"),
            (this.modalMessage =
              "Votre enregistrement a réussi, fermez cette fenêtre pour être rédirigé(e) vers la page de connexion");
          this.toggledModal();
        })
        .catch(() => {
          // alerts the user if the email or userName exist in database
          this.theme = "warning";
          this.modalTitle = "ATTENTION!";
          this.modalMessage =
            "L'email ou le nom d'utilisateur existe  déjà. Veuillez en saisir un autre ou connectez-vous";
          this.toggledModal();
        });
    },
  },
};
</script>

<style>
.logo {
  width: 200px;
}
.connexion {
  width: 100%;
  max-width: 500px;
}
</style>
