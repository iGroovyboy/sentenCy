export interface Tag {
  name: string;
  hotkey?: string;
}

export interface TaggedGroup {
  name: string;
  hotkey?: string;
  isSingle?: boolean;
  range: number[];
  text: string;
}

export type TaggedWords = Record<number, TaggedGroup>;

export type TaggedDataItem = TaggedGroup | Record<number, TaggedGroup> | string;

export type TaggedData = Array<TaggedDataItem>;

export type SkippedData = number[];

export type StoredTaggedData = Record<string, TaggedData>;
