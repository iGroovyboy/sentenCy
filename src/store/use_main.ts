import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export default defineStore("main", () => {
  const screen: Ref<number> = ref<number>(0);

  const setScreen = (id: number): void => {
    console.log(id);
    screen.value = +id;
  };

  return {
    screen,
    setScreen,
  };
});
