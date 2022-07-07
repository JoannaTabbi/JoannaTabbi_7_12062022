import "../css/style.css"   // import bootstrap styles overriden
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

import "bootstrap/dist/js/bootstrap.bundle"
