import { describe, afterAll, test, expect, vi } from "vitest";
import { useHotkey } from "@/common/use_hotkey.ts";
import { Tag } from "@/common/interfaces.ts";

describe("should mock console.log", () => {
  const consoleMock = vi
    .spyOn(console, "log")
    .mockImplementation(() => undefined);

  afterAll(() => {
    consoleMock.mockReset();
  });

  test("useHotkey must listen fot 2 and z keys only", () => {
    const tags: Tag[] = [
      {
        name: "Test_tag_2",
        hotkey: "2",
      },
      {
        name: "Test_tag_a",
        hotkey: "a",
      },
      {
        name: "Test_tag_''",
        hotkey: "",
      },
    ];

    const hotkeysToTest = [1, 2, "a", "F"];

    const fakeComponent = {
      setup() {
        useHotkey(tags, (tag: Tag) => {
          console.log(tag.name);
        });
      },
    };

    fakeComponent.setup();

    for (const key of hotkeysToTest) {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: key.toString() }),
      );
    }

    expect(consoleMock).toHaveBeenNthCalledWith(1, "Test_tag_2");
    expect(consoleMock).toHaveBeenNthCalledWith(2, "Test_tag_a");
  });
});
