import { useState, useEffect } from "react";

export function useTimer(startTime = 0) {
    const [times, setTimes] = useState({ start_time: startTime, current_time: startTime, passed_time: 0 })
    const [state, setState] = useState({ reset: true, is_running: false, })

    useEffect(() => {
        const timer = setInterval(cycle, 1000);
        function cycle() {
            if (times.current_time <= 0) {
                console.log("timer complete")
                reset();
                clearInterval(timer);
            }
            if (state.is_running && !state.reset) {
                setTimes((prev) => ({
                    ...prev,
                    current_time: prev.current_time--,
                    passed_time: prev.passed_time++
                }))
                console.log(times);
            }
            if (state.reset) {
                setTimes((prev) => ({
                    ...prev,
                    current_time: prev.start_time,
                    passed_time: 0
                }))
                clearInterval(timer)
            }
        }
        return () => clearInterval(timer);
    }, [state]);


    function start() {
        console.log("timer start")
        setState({ ...state, is_running: true })
    };
    function pause() {
        console.log("timer pause")
        setState({ ...state, is_running: false })
    };
    function resume() {
        console.log("timer resume")
        setState({ ...state, is_running: true })
    };
    function reset() {
        console.log("timer reset")
        setState({ reset: true, is_running: false })
    };

    return { times, state, start, pause, resume, reset };
}
