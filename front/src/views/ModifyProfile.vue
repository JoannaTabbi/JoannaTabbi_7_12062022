<template>
  <div class="main-content container main-margin-top bg-dark">
    <div class="row">
      <div class="col-12 mb-3 pt-3">
        <div class="card w-100 container-fluid p-0">
          <div class="row">
            <div class="col-12">
              <img
                class="img-fluid w-100 rounded-top"
                src="https://picsum.photos/800/200?random=1&grayscale"
                alt="photo aléatoire"
              />
            </div>
          </div>
          <div
            class="
              d-flex
              flex-column flex-md-row
              mb-5
              align-items-center
              justify-content-evenly
            "
          >
            <div
              class="
                avatar-container-round avatar-profile avatar-lg
                col-6 col-sm-3 col-lg-2
                ms-0 ms-lg-3
                mb-3 mb-lg-0
              "
            >
              <img :src="auth.user.imageUrl" alt="mon avatar" />
            </div>

            <div class="d-flex flex-column flex-sm-row justify-content-center">
              <div class="mt-3 mx-2 mt-lg-0">
                <button
                  class="btn btn-outline-dark py-2 px-3 rounded-pill shadow"
                  @click="exportData"
                >
                  Exporter mes données
                </button>
              </div>
              <div class="mt-3 mx-2 mt-lg-0">
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
            <!-- upload files form -->

            <form class="my-5 px-5" @submit.prevent="uploadUserFiles">
              <div class="col-12 border-bottom border-dark mb-5">
                <label for="formFile" class="form-label fs-4 fw-bold"
                  >Modifiez la photo</label
                >
              </div>
              <input
                class="form-control mb-2"
                name="image"
                type="file"
                id="formFile"
                accept="image/*"
                @change="selectImage"
              />
              <div>
                <button
                  type="reset"
                  class="
                    btn btn-danger
                    bg-gradient
                    rounded-5
                    m-3
                    text-white
                    fw-bold
                  "
                >
                  Réinitialiser
                </button>
                <button
                  type="submit"
                  class="
                    btn btn-dark
                    bg-gradient
                    rounded-5
                    m-3
                    text-white
                    fw-bold
                  "
                >
                  Modifier
                </button>
              </div>
            </form>

            <!-- upload files form end -->

            <div class="row mx-2 mx-sm-5 my-5">
              <div class="col-12 border-bottom border-dark mb-5">
                <h1 class="fs-4 text-center">Modifiez le profil</h1>
              </div>
              <DynamicForm
                :schema="formSchema"
                reset-message="Réinitialiser"
                submit-message="Modifier"
                :reset="true"
                :submit-function="onSubmit"
                :initial-values="this.userUpdate"
              />
            </div>
            <div class="row mx-2 mx-sm-5 my-5">
              <div class="col-12 border-bottom border-dark mb-5">
                <h1 class="fs-4 text-center">Modifiez le mot de passe</h1>
              </div>
              <DynamicForm
                :schema="passwordSchema"
                reset-message="Réinitialiser"
                submit-message="Modifier"
                :reset="true"
                :submit-function="onSubmit"
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
            theme="warning"
          >
            <template v-slot:modalBody>
              <p>
                {{ modalMessage }}
              </p>
            </template>
          </DynamicModal>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { useHandleErrorStore } from "@/stores/handleErrorStore";
import DynamicForm from "@/components/DynamicForm";
import DynamicModal from "@/components/DynamicModal";
import * as Yup from "yup";
import { userServices } from "@/_services";
import { loadServices } from "@/_services";
import router from "@/router/index";

export default {
  name: "modifyProfile",
  setup() {
    const auth = useAuthStore();
    const handleError = useHandleErrorStore();
    return { auth, handleError };
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
      ],
    };
    const passwordSchema = {
      fields: [
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
      //form data
      formSchema,
      passwordSchema,
      userUpdate: {
        _id: this.auth.user._id,
        userName: this.auth.user.userName,
        aboutMe: this.auth.user.aboutMe,
        email: this.auth.user.email,
        password: this.auth.user.password,
      },

      //modal data
      modalTitle: "ATTENTION",
      modalMessage:
        "Votre profil sera supprimé définitivement. Etes-vous sûr(e) de vouloir continuer ?",
      dismissModalText: "Abandonner",
      submitModalText: "Supprimer",
      showModal: false,

      //upload image date
      currentImage: undefined,
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
      if (value.password && value.password === this.auth.user.password) {
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
          this.handleError.triggerToast(err);
        });
    },

    //uploads a new user's avatar and update the data

    selectImage(event) {
      this.currentImage = event.target.files[0];
    },

    uploadUserFiles() {
      let formData = new FormData();
      formData.append("user", this.userUpdate);
      formData.append("image", this.currentImage);

      loadServices
        .uploadUserFiles(formData)
        .then((res) => {
          this.auth.user = res.data;
          router.push("/myProfile");
        })
        .catch((err) => {
          this.handleError.triggerToast(err);
          this.currentImage = undefined;
        });
    },

    // exports user's data
    exportData() {
      userServices
        .exportData()
        .then((res) => {
          loadServices.excelParser().exportDataFromJSON(res.data, null, null);
        })
        .catch((err) => this.handleError.triggerToast(err));
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
        this.handleError.triggerToast(err);
      }
    },
  },
};
</script>

<style scoped></style>
