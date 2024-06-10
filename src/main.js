// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from "vue";
// import Vue from "vue";
import App from "./App.vue";
import routes from './router/routes'
// import {VuelidatePlugin} from "@vuelidate/core"; 

const app = createApp(App);
app.use(routes);
// app.use(VuelidatePlugin);
app.mount("#app");