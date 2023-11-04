import { SOURCE_TEXT_HEADER_NAME, STORAGE_KEY } from "@/common/constants.ts";
import { StoredTaggedData, Tag, TaggedGroup } from "@/common/interfaces.ts";
import isObject from "lodash/isObject";
import { unparse } from "papaparse";
import storage from "localstorage-slim";

export const csvExport = () => {
  const headerFields = csvPrepareHeader();
  if (!headerFields?.length) {
    return null;
  }

  const data = csvPrepareData();
  if (!data?.length) {
    return null;
  }

  return unparse({
    fields: headerFields,
    data: data,
  });
};

const csvPrepareHeader = (): string[] => {
  const headerFields = [SOURCE_TEXT_HEADER_NAME];

  const tags: Tag[] | null = storage.get(STORAGE_KEY.TAGS);
  if (tags && tags.length) {
    for (const tag of tags) {
      headerFields.push(tag?.name?.toUpperCase());
    }
  }

  return headerFields;
};

export const csvPrepareData = (): null | Array<string[]> => {
    const sourceData: string[] | null = storage.get(STORAGE_KEY.PROCESSED_SOURCE);
    const taggedData: StoredTaggedData | null = storage.get(
        STORAGE_KEY.TAGGED_DATA,
    );

    const headerFields = csvPrepareHeader();

    const rows: Array<string[]> = [];

  sourceData?.forEach((sourceRow: string, id: number) => {
    const row = [sourceRow];
    const availableTaggedData: Record<string, string> = {};
    if (taggedData?.[id]) {
      for (const wordData of taggedData[id]) {
        if (isObject(wordData)) {
          if ("isSingle" in wordData && wordData.isSingle) {
            availableTaggedData[(wordData as TaggedGroup).name] = (
              wordData as TaggedGroup
            ).text;
          } else {
            let tag = "";
            const text: string[] = [];
            for (const [_, subwordData] of Object.entries(wordData)) {
              tag = tag || (subwordData as TaggedGroup).name;
              text.push((subwordData as TaggedGroup).text);
            }
            availableTaggedData[tag] = text.join(" ");
          }
        }
      }
    } else {
      // process sentences which has no tags
      // TODO: add option to save/remove empty(untagged) sentences
    }

    // we need same sequence of tags here
    for (const field of headerFields) {
      if (field !== SOURCE_TEXT_HEADER_NAME) {
        row.push(availableTaggedData[field.toLowerCase()] || "");
      }
    }

    console.log(row);
    rows.push(row);
  });

  return rows;
};
