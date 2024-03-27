
export function formatTime(time: number | undefined) {
    if (!time) {
        time = 0;
    }
    if (time < 0) {
        throw new Error("invalid input. time is negative!")
    }
    const min = Math.floor(time / 60);
    const sec = time % 60;

    function format(time: number) {
        return time > 9 ? time.toString() : "0" + time.toString()
    }

    return [format(min), format(sec)];
}   