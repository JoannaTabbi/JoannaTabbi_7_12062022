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

          <DynamicForm :schema="formSchema" submit-message="Connexion" :submit-function="login"/>
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
import { authServices } from '@/_services';
import DynamicForm from '@/components/DynamicForm';
import * as Yup from "yup";
import router from '../router/index';
import { useAuthStore } from '../stores/authStore';

export default {
  data() {
    const formSchema = {
      fields: [
        {
          label: 'EMAIL',
          name: 'email',
          as: 'input',
          type: 'email',
          id: 'email',
          placeholder: "jean.dupond@exemple.fr",
          rules: Yup.string().required("L'email est obligatoire").email("L'email n'est pas valide")
        },
        {
          label: 'MOT DE PASSE',
          name: 'password',
          as: 'input',
          type: 'password',
          id: 'password',
          rules: Yup.string().required("Le mot de passe est obligatoire")
        },
      ],
    };
    return {
      formSchema,
      user: {
        email: this.email,
        password: this.password
      },
    };
  },
  components: {
    DynamicForm
  },
  methods: {
    //logs in user once the connexion fields validated
    async login(values) {
      console.log(values);
      const res = await authServices.loginUser(values)
        
        // si pas de réponse, redirige l'utilisateur vers la page de login
        if(!res.ok) {
           router.push('/login')
        }

         //store the user and the token in AuthStore in order to reuse it 
          const auth = useAuthStore();
          auth.loggedIn(res.data.token, res.data.newRefreshToken, res.data.User)

          //redirects the authenticated user to home page
          router.push('/')
    }
  }
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
