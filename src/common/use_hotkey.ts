import { onMounted, onBeforeUnmount } from "vue";
import { Tag } from "@/common/interfaces.ts";

type Func = (tag: any) => {};

export const useHotkey = (tags: Tag[] | [], callback: Func) => {
  const handleKeyDown = (event) => {
    const tag = tags.find(
      (t) => t.hotkey?.toLowerCase() === event?.key?.toLowerCase(),
    );

    if (tag) {
      callback(tag);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
};
