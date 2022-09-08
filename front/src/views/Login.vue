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
          <h1 class="fs-4 text-center">Page de connexion</h1>
        </div>
        <div class="col-12 mt-5 mb-4">

          <!-- connexion form -->

          <Form class="form" @submit="login" :validation-schema="schema">
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
                  v-model="user.email"
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
                  v-model="user.password"
                />
                <ErrorMessage name="inputPassword" as="small" />
              </div>
            </div>

            <!-- submit -->

            <button
              type="submit"
              class="btn btn-dark bg-gradient rounded-5 w-100 mt-4 text-white fw-bold"
            >
              Connexion
            </button>
          </Form>
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
</template>

<script>
import axios from "axios";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import router from '../router/index';
import { useAuthStore } from '../stores/authStore';

export default {
  data() {
    // defines the validation rules and error messages for each connexion field
    const schema = yup.object().shape({
      inputEmail: yup
        .string()
        .required("L'email est obligatoire")
        .email("L'email n'est pas valide"),
      inputPassword: yup
        .string()
        .required("Le mot de passe est obligatoire")
    });
    return {
      schema,
      user: {
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
    //logs in user once the connexion fields validated
    async login() {
      const res = await axios
        .post(process.env.VUE_APP_API_URL + "/auth/login", this.user)
        // si pas de réponse, redirige l'utilisateur vers la page de login
        if(!res.ok) {
           router.push('/login')
        }
         // axios intercepts the token and places it in the header authorization
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
         //store the user and the token in AuthStore in order to reuse it 
          const auth = useAuthStore();
          auth.loggedIn(res.data.token, res.data.refreshToken, res.data.User)

          //redirects the authenticated user to home page
          router.push('/')
          // displays the header
          this.$emit("changeIsConnected", true); 
    }
  },
  // sets the value of isConnected to false in order to not show the header on the login page
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
