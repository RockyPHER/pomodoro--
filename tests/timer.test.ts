import { expect, test } from "vitest";
import { formatTime } from "../src/scripts/timeFormat";

test("formatTime handles 0 seconds", () => {
  expect(formatTime(0)).toEqual(["00", "00"]);
});

test("formatTime handles undefined", () => {
  expect(formatTime(undefined)).toEqual(["00", "00"]);
});

test("formatTime converts seconds to mm:ss correctly", () => {
  const cases = [
    { input: 10, expected: ["00", "10"] },
    { input: 60, expected: ["01", "00"] },
    { input: 90, expected: ["01", "30"] },
    { input: 3600, expected: ["60", "00"] },
  ];
  cases.forEach(({ input, expected }) => {
    expect(formatTime(input)).toEqual(expected);
  });
});

test("formatTime throws on negative input", () => {
  expect(() => formatTime(-1)).toThrowError("invalid input. time is negative!");
});
