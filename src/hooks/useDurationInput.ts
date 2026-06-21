import { ChangeEvent, useState } from "react";
import { formatTime } from "../scripts/timeFormat";

interface DurationInput {
  min: string;
  sec: string;
  duration: number;
  handleMinInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSecInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function useDurationInput(initialDuration: number): DurationInput {
  const [min, setMin] = useState(() => formatTime(initialDuration)[0]);
  const [sec, setSec] = useState(() => formatTime(initialDuration)[1]);

  const clamp = (value: string, max: number, setter: (v: string) => void) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return setter("00");
    if (num > max) return setter(String(max).padStart(2, "0"));
    if (value.length > 2) return setter(value.slice(1));
    setter(String(num).padStart(2, "0"));
  };

  const handleMinInput = (e: ChangeEvent<HTMLInputElement>) =>
    clamp(e.target.value, 60, setMin);

  const handleSecInput = (e: ChangeEvent<HTMLInputElement>) =>
    clamp(e.target.value, 59, setSec);

  const duration = 60 * parseInt(min, 10) + parseInt(sec, 10);

  return { min, sec, duration, handleMinInput, handleSecInput };
}
