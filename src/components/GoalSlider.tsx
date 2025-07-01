import React from "react";
import { CustomSlider } from "./CustomSlider";

export function GoalSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue: (v: number) => string;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-lg font-semibold mb-2 text-[#2F3036]">{label}</div>
      <div className="text-center text-[#1F2024] font-sans font-mono text-lg mb-2">
        {formatValue(value)}
      </div>
      <CustomSlider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        ariaLabel={label}
      />
    </div>
  );
}
