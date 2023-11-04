import { createRouter, createWebHistory } from "vue-router";

import HomePage from "@/components/pages/app-home.vue";
import SourcePage from "@/components/pages/app-source.vue";
import TagsPage from "@/components/pages/app-tags.vue";
import AnnotationPage from "@/components/pages/app-annotation.vue";

export const enum Route {
  Home = "home",
  Source = "source",
  Tags = "tags",
  Annotation = "annotation",
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      path: "/home",
      name: Route.Home,
      component: HomePage,
    },
    {
      path: "/source",
      name: Route.Source,
      component: SourcePage,
    },
    {
      path: "/tags",
      name: Route.Tags,
      component: TagsPage,
    },
    {
      path: "/annotation",
      name: Route.Annotation,
      component: AnnotationPage,
    },
  ],
});
