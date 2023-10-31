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
