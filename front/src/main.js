import "../css/style.css"   // import bootstrap styles overriden
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { ObserveVisibility } from 'vue-observe-visibility'
import moment from 'moment'
import 'moment/locale/fr'

import axiosInterceptors from "./_interceptors/axios"
axiosInterceptors()

const pinia = createPinia()
// mantain pinia stores persistant and stable
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
app.use(router)
app.directive('observe-visibility', ObserveVisibility)

//add filter to format data
app.config.globalProperties.$filters = {
    formatDate(value) {
        if (value) {
            return moment(String(value)).format('LL')
          }
    }
  }

app.mount('#app')
import "bootstrap/dist/js/bootstrap.bundle"