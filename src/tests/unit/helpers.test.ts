import { describe, afterEach, expect, test, vi } from "vitest";
import {
  getArrNextKey,
  getArrPrevKey,
  incrStringVersion,
  jenkinsHash,
} from "@/common/helpers.ts";

describe("helpers.ts tests", () => {
  const testString = "sentenCy";

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("jenkinsHash always returns same number for same string", async () => {
    const testStringHash = 1142071597;
    expect(jenkinsHash(testString)).toBe(testStringHash);
  });

  test("incrStringVersion increases version of numeric version w/wo postfix", async () => {
    const version = "100";
    const version_0 = incrStringVersion(version);

    expect(version_0).toBe("100_0");

    const version_1 = incrStringVersion(version_0);
    expect(version_1).toBe("100_1");
  });

  test("getArrNextKey", async () => {
    const arr = ["zero", "one", "two"];
    const currentKey = 1;
    const keyTwo = getArrNextKey(arr, currentKey);

    expect(keyTwo).toBe(2);
    expect(arr[keyTwo]).toBe("two");

    const keyNull = getArrNextKey(arr, keyTwo);
    expect(keyNull).toBe(null);
  });

  test("getArrPrevKey", async () => {
    const arr = ["zero", "one", "two"];
    const currentKey = 1;
    const keyZero = getArrPrevKey(arr, currentKey);

    expect(keyZero).toBe(0);
    expect(arr[keyZero]).toBe("zero");

    const keyNull = getArrPrevKey(arr, keyZero);
    expect(keyNull).toBe(null);
  });
});
