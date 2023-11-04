import { createApp } from "vue";
import "./assets/style/index.scss";
import "fork-awesome/css/fork-awesome.min.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import VResizable from "v-resizable";
import { router } from "@/common/router.ts";

const app = createApp(App);

const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(VResizable);

app.mount("#app");
