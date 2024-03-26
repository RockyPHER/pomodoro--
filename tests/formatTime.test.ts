import { expect, test } from "vitest";
import { formatTime } from "../src/scripts/timeFormat"

test("returns formatted time", async () => {
    const testCases = [
        { input: 10, expected: ["00", "10"] },
        { input: 100, expected: ["01", "40"] },
        { input: 243, expected: ["04", "03"] }
    ];

    testCases.forEach(({ input, expected }) => {
        expect(formatTime(input)).toEqual(expected);
    });
});

test("throws error if input is negative", async () => {
    const input = -100;
    expect(() => formatTime(input)).toThrowError("invalid input. time is negative!")
})