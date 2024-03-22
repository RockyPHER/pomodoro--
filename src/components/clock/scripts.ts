export const Timer = {
    time_start: 0,
    time_current: 0,
    time_passed: 0,
    time_remaining: 0,
    start: false,
    stop: true,
    skip: false,
    completed: false,
}

function getCountdown() {
    return 10;
}
function getNextCountdown() {
    return 20;
}

function attributeTimeValues(startTime: number) {
    Timer.time_start = startTime;
    Timer.time_current = startTime;
    Timer.time_passed = Timer.time_start - Timer.time_current;
    Timer.time_remaining = Timer.time_start - Timer.time_passed;
}

function startTimer() {
    console.log("Timer started!")
    const times = setInterval(intervalCycle, 1000)
    function intervalCycle() {
        console.log(Timer.time_current)
        console.log(Timer)
        if (!Timer.start || Timer.time_remaining === 0) {
            clearInterval(times);
            console.log("clearing interval")
            return
        }
        if (Timer.stop) {
            console.log("Stopping timer");
            Timer.start = false;
            resetTimer();
            Timer.completed = false;
            clearInterval(times);
            console.log("clearing interval")
            return
        }
        if (Timer.skip) {
            console.log("Skipping timer");
            Timer.start = false;
            resetTimer();
            Timer.completed = true;
            Timer.skip = false;
            clearInterval(times);
            console.log("clearing interval")
            return
        }
        Timer.time_passed = Timer.time_start - Timer.time_current;
        Timer.time_remaining = Timer.time_start - Timer.time_passed;
        Timer.time_current--
    }
}

function resetTimer() {
    Timer.time_remaining = Timer.time_passed = Timer.time_remaining = Timer.time_current = Timer.time_start = 0;
}

export function handleStartTimer() {
    if (Timer.start) {
        Timer.start = false;
        Timer.stop = true;
    }
    if (!Timer.start) {
        let timeStart;
        Timer.completed ? timeStart = getNextCountdown() : timeStart = getCountdown();
        attributeTimeValues(timeStart);
        Timer.start = true;
        Timer.stop = false;
        Timer.completed = false;
        console.log("Timer values", Timer);
        startTimer();
    }
}