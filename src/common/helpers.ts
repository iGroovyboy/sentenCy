import isEmpty from "lodash/isEmpty";

export function jenkinsHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
    hash += hash << 10;
    hash ^= hash >> 6;
  }
  hash += hash << 3;
  hash ^= hash >> 11;
  hash += hash << 15;

  return hash >>> 0;
}

export const extendSelectionToWord = () => {
  const selection = document.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    let startOffset = range.startOffset;
    const endContainer = range.endContainer;
    let endOffset = range.endOffset;

    // Find the start of the word
    while (
      startOffset > 0 &&
      /\S/.test(startContainer.textContent[startOffset - 1])
    ) {
      startOffset--;
    }

    // Find the end of the word
    while (
      endOffset < endContainer.length &&
      /\S/.test(endContainer.textContent[endOffset])
    ) {
      endOffset++;
    }

    // Set the new range to include the entire word
    const newRange = document.createRange();
    newRange.setStart(startContainer, startOffset);
    newRange.setEnd(endContainer, endOffset);

    // Replace the current selection with the extended selection
    selection.removeAllRanges();
    selection.addRange(newRange);

    console.log("extend is done");
  }
};

export const incrStringVersion = (input: string) => {
  const match = input.match(/_(\d+)$/);

  if (match) {
    const number = parseInt(match[1]);
    return input.replace(/_\d+$/, `_${number + 1}`);
  }

  return `${input}_0`;
};

export const getNextItem = (map, prevKey) => {
  const entries = Array.from(map.entries());
  const prevIndex = entries.findIndex(([key, value]) => key === prevKey);

  if (prevIndex !== -1 && prevIndex < entries.length - 1) {
    return entries[prevIndex + 1];
  }

  return null; // Return null if there is no next item
};

export const getArrNextKey = (arr: any[], currentId: number): number | null => {
  if (
    !isEmpty(arr) &&
    currentId !== -1 &&
    currentId < arr.length - 1 &&
    !isEmpty(arr[currentId + 1])
  ) {
    return currentId + 1;
  }

  return null;
};

export const getArrPrevKey = (arr: any[], currentId: number): number | null => {
  if (
    !isEmpty(arr) &&
    currentId !== -1 &&
    currentId > 0 &&
    !isEmpty(arr[currentId - 1])
  ) {
    return currentId - 1;
  }

  return null;
};
