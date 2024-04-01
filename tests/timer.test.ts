import { expect, test } from "vitest";
import { useTimer } from "../src/scripts/timer"

test("start timer", async () => {
    const { start, times, state } = useTimer(10);
    console.log(times)
})