import "../css/style.css"   // import bootstrap styles overriden
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './interceptors/axios'

const pinia = createPinia()
createApp(App).use(pinia).use(router).mount('#app')

import "bootstrap/dist/js/bootstrap.bundle"
