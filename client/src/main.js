// Bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.js";
import { Chart } from 'chart.js/auto';

// Chart.defaults.backgroundColor = '#9BD0F5';
// Chart.defaults.borderColor = '#36A2EB';
// Chart.defaults.color = '#000';

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import App from "./App.vue";
import router from "./router";

import axios from "axios";

if (process.env.NODE_ENV !== "production") {
  axios.defaults.baseURL = "http://localhost:8080";
} else {
  axios.defaults.baseURL = "https://app.cincitechlabs.com";
}

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
