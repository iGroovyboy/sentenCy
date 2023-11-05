import { onBeforeUnmount } from "vue";
import { Tag } from "@/common/interfaces.ts";
import { isFunction } from "lodash";

export const useHotkey = (tags: Tag[] | [], callback: unknown) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const tag = tags.find(
      (t) => t.hotkey?.toLowerCase() === event?.key?.toLowerCase(),
    );

    if (tag && isFunction(callback)) {
      callback(tag);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
};
