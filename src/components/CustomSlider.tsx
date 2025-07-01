import React from "react";

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
}

export function CustomSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  ariaLabel,
}: CustomSliderProps) {
  // Slider dimensions
  const width = 278; // px, as in your Figma
  const height = 8; // px, as in your Figma
  const thumbSize = 20; // px

  // Calculate position
  const percent = (value - min) / (max - min);
  const progressWidth = percent * width;
  const thumbLeft = progressWidth - thumbSize / 2;

  return (
    <div className="relative" style={{ width: width + thumbSize, height: 40 }}>
      {/* Track */}
      <div
        style={{
          position: "absolute",
          left: thumbSize / 2,
          top: 16,
          width,
          height,
          borderRadius: height / 2,
          background: "#E8E9F1",
        }}
      />
      {/* Progress */}
      <div
        style={{
          position: "absolute",
          left: thumbSize / 2,
          top: 16,
          width: progressWidth,
          height,
          borderRadius: height / 2,
          background: "#006FFD",
        }}
      />
      {/* Thumb */}
      <div
        style={{
          position: "absolute",
          left: thumbLeft + thumbSize / 2,
          top: 9,
          width: thumbSize,
          height: thumbSize,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#006FFD",
          }}
        />
      </div>
      {/* Range input */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={ariaLabel}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: width + thumbSize,
          height: 40,
          opacity: 0,
          cursor: "pointer",
        }}
      />
    </div>
  );
}
