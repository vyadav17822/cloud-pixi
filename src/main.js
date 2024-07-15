// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')

import { createApp } from "vue";
import PrimeVue from 'primevue/config';
// import "./style.css"
// import Aura from "./pixi-styles";
// import Vue from "vue";
import App from "./App.vue";
import routes from './router/routes'
import {runSuiteCommand} from './utils'
// import {VuelidatePlugin} from "@vuelidate/core"; 

const app = createApp(App);
app.config.globalProperties.$runSuiteCommand = runSuiteCommand;
localStorage.setItem("isSuiteAborted", false);
app.use(routes);
// app.use(PrimeVue, {
//     unstyled: true, pt: Aura
// });
app.use(PrimeVue, {
    unstyled: true
});
app.mount("#app");