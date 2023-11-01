import { createApp } from "vue";
import "./assets/style/index.scss";
import "fork-awesome/css/fork-awesome.min.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import VResizable from "v-resizable";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
app.use(VResizable);
app.mount("#app");
