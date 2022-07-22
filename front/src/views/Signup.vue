<template>
  <div class="vh-100 bg-image">
    <div class="connexion container py-4 bg-secondary h-100">
      <div class="row px-2 px-sm-5 h-100">
        <div class="col-12 border-bottom border-dark">
          <img
            class="d-flex mb-5"
            src="../assets/logos/icon-left-font-monochrome-black-rect.png"
            alt="logo Groupomania"
          />
          <h1 class="fs-4 text-center">Page d'inscription</h1>
        </div>
        <div class="col-12 mt-5 mb-4">
          <Form class="form" @submit="register" :validation-schema="schema">
            <div class="row mb-3 align-items-center justify-content-between">
              <label for="inputUserName" class="col-2 col-form-label"
                ><i
                  class="fa-regular fa-user border border-3 border-dark rounded-3 p-2"
                ></i
              ></label>
              <div class="col-10">
                <Field
                  type="text"
                  class="form-control"
                  name="inputUserName"
                  id="inputUserName"
                  placeholder="Jean_0814"
                  v-model.trim="user.userName"
                />
                <ErrorMessage name="inputUserName" as="small" />
              </div>
            </div>
            <div class="row mb-3 align-items-center justify-content-between">
              <label for="inputEmail" class="col-2 col-form-label"
                ><i
                  class="fa-solid fa-at border border-3 border-dark rounded-3 p-2"
                ></i
              ></label>
              <div class="col-10">
                <Field
                  type="email"
                  class="form-control"
                  id="inputEmail"
                  name="inputEmail"
                  placeholder="jean.dupond@exemple.fr"
                  v-model.trim="user.email"
                  :rules="validateEmail"
                />
                <ErrorMessage name="inputEmail" as="small" />
              </div>
            </div>
            <div class="row mb-3 align-items-center justify-content-between">
              <label for="inputPassword" class="col-2 col-form-label"
                ><i
                  class="fa-solid fa-lock border border-3 border-dark rounded-3 p-2"
                ></i
              ></label>
              <div class="col-10">
                <Field
                  type="password"
                  class="form-control"
                  id="inputPassword"
                  name="inputPassword"
                  v-model.trim="user.password"
                />
                <ErrorMessage name="inputPassword" as="small" />
              </div>
            </div>
            <button
              type="submit"
              class="btn btn-dark bg-gradient rounded-5 w-100 mt-4 text-white fw-bold"
            >
              Je m'inscris
            </button>
          </Form>
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
</template>

<script>
import axios from "axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  data() {
    const schema = yup.object().shape({
      inputUserName: yup
        .string()
        .required("Ce champs est obligatoire")
        .min(3, "Le nom de l'utilisateur doit contenir au moins 3 caractères")
        .matches(/^\S*$/, "Le mot de passe ne doit pas contenir des espaces blancs"),
      inputEmail: yup
        .string()
        .required("Ce champs est obligatoire")
        .email("L'email n'est pas valide"),
      inputPassword: yup
        .string()
        .required("Ce champs est obligatoire")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, "Le mot de passe doit contenir au moins une majuscule, une minuscule et un nombre")
        .matches(/^\S*$/, "Le mot de passe ne doit pas contenir des espaces blancs")
    });
    return {
      schema,
      user: {
        userName: "",
        email: "",
        password: "",
      },
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  methods: {
    //register the new user in the database
    register() {
      axios
        .post(process.env.VUE_APP_API_URL + "auth/signup", this.user)
        .then((res) => {
          alert("Votre enregistrement a réussi, vous allez être rédirigé(e) vers la page d'identification")
          window.location.href = "./login"
    })
        // alerts the user if the email or userName exist in database
        .catch((err) => {if (err.response.data.message.includes('unique')) {
          alert("L'email ou le nom d'utilisateur existe déjà. Veuillez en saisir un autre")
        }});
    }, 
  },
  // sets the value of isConnected to false in order to not show the header on the signup page
  mounted() {
    this.$emit("changeIsConnected", false);
  },
};
</script>

<style scoped>
img {
  width: 200px;
}
.connexion {
  width: 100%;
  max-width: 576px;
}
</style>
