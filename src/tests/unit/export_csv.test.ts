import { describe, expect, test } from "vitest";
import { csvExport } from "@/common/export_csv.ts";
import { Tag } from "@/common/interfaces.ts";
import { STORAGE_KEY } from "@/common/constants.ts";

describe("export_csv.ts tests", () => {
  test("csvExport: empty localStorage returns null", async () => {
    expect(csvExport()).toStrictEqual(null);
  });

  const populateTestData = () => {
    const tags: Tag[] = [
      { name: "Noun", hotkey: "" },
      { name: "Custom_selection", hotkey: "" },
    ];
    localStorage.setItem(STORAGE_KEY.TAGS, JSON.stringify(tags));

    const processedSource = [
      "To be, or not to be, that is the question.",
      "In the beginning God created the heavens and the earth.",
      "I have a dream.",
    ];
    localStorage.setItem(
      STORAGE_KEY.PROCESSED_SOURCE,
      JSON.stringify(processedSource),
    );

    const taggedData = {
      0: [
        "To",
        "be,",
        "or",
        "not",
        "to",
        "be,",
        "that",
        "is",
        "the",
        {
          name: "Noun",
          hotkey: "",
          range: [9, 9],
          isSingle: true,
          text: "question.",
        },
      ],
      1: [
        "In",
        "the",
        "beginning",
        "God",
        "created",
        "the",
        "heavens",
        "and",
        "the",
        "earth.",
      ],
      2: [
        "I",
        {
          "1": {
            name: "Noun",
            hotkey: "",
            range: [1, 3],
            isSingle: false,
            text: "have",
          },
          "2": {
            name: "Noun",
            hotkey: "",
            range: [1, 3],
            isSingle: false,
            text: "a",
          },
          "3": {
            name: "Noun",
            hotkey: "",
            range: [1, 3],
            isSingle: false,
            text: "dream.",
          },
        },
        "a",
        "dream.",
      ],
    };
    localStorage.setItem(STORAGE_KEY.TAGGED_DATA, JSON.stringify(taggedData));

    const skippedData = [1];
    localStorage.setItem(STORAGE_KEY.SKIPPED_DATA, JSON.stringify(skippedData));

    return `SOURCE,NOUN,CUSTOM_SELECTION
"To be, or not to be, that is the question.",,
In the beginning God created the heavens and the earth.,,
I have a dream.,,`;
  };

  test("csvExport: populated localStorage returns CSV", async () => {
    const response = populateTestData().replace(/\r\n/g, "\n");
    expect(csvExport()?.replace(/\r\n/g, "\n")).toStrictEqual(response);
  });
});
