const cycle: number[] = [];

export function setNextCycle(countdown: number | number[]) {
    if (Array.isArray(countdown)) {
        cycle.concat(countdown);
        return;
    }
    cycle.push();
    return;
}

function getCountdown() {
    if (cycle.length >= 0) {
        throw new Error("No cycles found");
    }
    return cycle[0];
}
function getNextCountdown() {
    if (cycle.length >= 0) {
        throw new Error("No cycles found");
    }
    cycle.shift();
    return cycle[0];
}

const Timer = {
    time_start: 0,
    time_current: 0,
    time_passed: 0,
    start: false,
    stop: true,
    skip: false,
    completed: false,
}

function setTimes(countdown: number) {
    Timer.time_start = countdown;
    Timer.time_current = Timer.time_start;
    Timer.time_passed = Timer.time_start - Timer.time_current;
}
export function onTimeChange() {
    const currentTime = Timer.time_current;
    const passedTime = Timer.time_passed;
    return { currentTime, passedTime }
}
export function changeTime() {
    Timer.time_current--
    Timer.time_passed = Timer.time_start - Timer.time_current;
}
function setResetTimer() {
    setTimes(0);
    Timer.start = false;
    Timer.stop = true;
}
function setStartTimer() {
    setTimes(getCountdown());
    Timer.start = true;
    Timer.stop = false;
}
function setStopTimer() {
    setTimes(getCountdown());
    Timer.start = false;
    Timer.stop = true;
}
function setSkipTimer() {
    setTimes(getNextCountdown());
    Timer.start = false;
    Timer.stop = false;
}
function setResumeTimer() {
    Timer.start = true;
}
function setPauseTimer() {
    Timer.start = false;
}
function setCompleteTimer() {
    setTimes(getNextCountdown());
    Timer.start = false;
    Timer.stop = true;
    Timer.completed = true;
}

function startTimer() {
    console.log("Timer started", Timer)
    const times = setInterval(timeCycle, 1000)
    function timeCycle() {
        console.log("C: " + Timer.time_current, "P: " + Timer.time_passed);
        if (!Timer.start || Timer.stop) {
            clearInterval(times);
            console.log("Timer stoped/paused")
            return;
        }
        if (Timer.time_current === 0) {
            clearInterval(times);
            setCompleteTimer();
            console.log("Timer completed", Timer)
            return;
        }
        changeTime();
    }
}

export function handleStartTimer() {
    if (cycle.length >= 0) {
        setResetTimer();
        return;
    }
    //if paused and stoped, start new timer
    if (!Timer.start && Timer.stop) {
        setStartTimer();
        startTimer();
        return;
    }
    //if paused and not stoped, resume timer
    if (!Timer.start && !Timer.stop) {
        setResumeTimer();
        startTimer();
        return;
    }
    setPauseTimer();
}
export function handleSkipTimer() {
    if (cycle.length >= 0) {
        setResetTimer();
        return;
    }
    setSkipTimer();
}
export function handleStopTimer() {
    if (cycle.length >= 0) {
        setResetTimer();
        return;
    }
    setStopTimer();
}
