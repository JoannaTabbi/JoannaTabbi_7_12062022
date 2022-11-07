<template>
  <div>
    <div class="vh-100 bg-image">
      <div class="connexion container py-4 bg-secondary h-100">
        <div class="row px-2 px-sm-5 h-100">
          <div class="col-12 border-bottom border-dark">
            <img
              class="d-flex mb-5"
              src="../assets/logos/icon-left-font-monochrome-black-rect.png"
              alt="logo Groupomania"
            />
            <h1 class="fs-4 text-center">Page de connexion</h1>
          </div>
          <div class="col-12 mt-5 mb-4">
            <!-- connexion form -->

            <DynamicForm
              :schema="formSchema"
              submit-message="Connexion"
              :submit-function="login"
            />
          </div>
          <div class="col-12 mb-3">
            <p class="mb-0">Pas encore inscrit ?</p>
            <router-link to="/signup" class="text-dark fs-5 fw-bold"
              >Créez votre compte</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <Teleport to="#modals">
      <DynamicModal
        :show="showModal"
        :modal-title="modalTitle"
        submit-modal-text="Fermer"
        @submitted="toggledModal"
        @closed="toggledModal"
        :submit="true"
        :theme="theme"
      >
        <template v-slot:modalBody>
          <p>
            {{ modalMessage }}
          </p>
        </template>
      </DynamicModal>
    </Teleport>
  </div>
</template>

<script>
import { authServices } from "@/_services";
import DynamicForm from "@/components/DynamicForm";
import DynamicModal from "@/components/DynamicModal";
import * as Yup from "yup";
import router from "../router/index";
import { useAuthStore } from "../stores/authStore";

export default {
  data() {
    const formSchema = {
      fields: [
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
          id: "password",
          rules: Yup.string().required("Le mot de passe est obligatoire"),
        },
      ],
    };
    return {
      formSchema,
      user: {
        email: this.email,
        password: this.password,
      },
      showModal: false,
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
    // handle error response
    handleError(status, error) {
      if (status === 429) {
        this.modalMessage =
            "Vous avez atteint le nombre d'essais authorisé. Veuillez attendre 15 minutes avant de vous connecter à nouveau";
      } else if (status === 401) {
        switch(error) {
            case "Incorrect password" :
            this.modalMessage =
            "Le mot de passe est incorrect.";
            break;
            case "User not found" :
            this.modalMessage =
            "L'email est incorrect.";
            break;
            default : 
            this.modalMessage = `Une erreur est survenue: ${error}`
          }
      } else {
        this.modalMessage = "Une erreur inconnue est survenue"
      }
      
    },
    //logs in user once the connexion fields validated
    login(values) {
      authServices
        .loginUser(values)
        .then((res) => {
          //store the user and the token in AuthStore in order to reuse it
          const auth = useAuthStore();
          auth.loggedIn(
            res.data.token,
            res.data.newRefreshToken,
            res.data.User
          );

          //redirects the authenticated user to home page
          router.push("/");
        })
        // si pas de réponse, redirige l'utilisateur vers la page de login
        .catch((err) => {
          console.log(err.response);
          this.theme = "warning";
          this.modalTitle = "ATTENTION!";
          this.handleError(err.response.status, err.response.data.error);
          this.toggledModal();
        });
    },
  },
};
</script>

<style scoped>
img {
  width: 200px;
}
.connexion {
  width: 100%;
  max-width: 500px;
}
</style>
