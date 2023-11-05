import isEmpty from "lodash/isEmpty";

export const jenkinsHash = (str: string): number => {
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
};

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
      startContainer?.textContent?.[startOffset - 1] &&
      /\S/.test(startContainer?.textContent?.[startOffset - 1])
    ) {
      startOffset--;
    }

    // Find the end of the word
    while (
      endOffset < (endContainer as unknown as string[])?.length &&
      endContainer?.textContent &&
      /\S/.test(endContainer?.textContent?.[endOffset])
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

export const getArrNextKey = (
  arr: string[],
  currentId: number,
): number | null => {
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

export const getArrPrevKey = (
  arr: string[],
  currentId: number,
): number | null => {
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

export const openWindowWithBlob = (data: string, type = "text/json") => {
  try {
    const blob = new Blob([data], { type: type });
    window.open(URL.createObjectURL(blob));
  } catch (e) {
    console.error(e);
    alert(e);
  }
};
