import { SOURCE_TEXT_HEADER_NAME, STORAGE_KEY } from "@/common/constants.ts";
import { Tag, TaggedGroup } from "@/common/interfaces.ts";
import isObject from "lodash/isObject";
import { unparse } from "papaparse";

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

  const tagsRaw = localStorage.getItem(STORAGE_KEY.TAGS);
  if (tagsRaw?.length) {
    const tags: Tag[] = JSON.parse(tagsRaw);
    if (tags.length) {
      for (const tag of tags) {
        headerFields.push(tag?.name?.toUpperCase());
      }
    }
  }

  return headerFields;
};

export const csvPrepareData = (): null | Array<string[]> => {
  const sourceDataRaw = localStorage.getItem(STORAGE_KEY.PROCESSED_SOURCE);
  const taggedDataRaw = localStorage.getItem(STORAGE_KEY.TAGGED_DATA);

  if (!sourceDataRaw?.length) {
    return null;
  }

  const sourceData = JSON.parse(sourceDataRaw);
  const taggedData = JSON.parse(taggedDataRaw || "{}");

  const headerFields = csvPrepareHeader();

  console.clear();
  console.log(headerFields);

  const rows: Array<string[]> = [];

  sourceData.forEach((sourceRow: string, id: number) => {
    const row = [sourceRow];
    const availableTaggedData: Record<string, string> = {};
    if (taggedData[id]) {
      for (const wordData of taggedData[id]) {
        if (isObject(wordData)) {
          if (wordData.hasOwnProperty("isSingle") && wordData.isSingle) {
            availableTaggedData[wordData.name] = wordData.text;
          } else {
            let tag = "";
            const text: string[] = [];
            for (const [i, subwordData] of Object.entries(wordData)) {
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
