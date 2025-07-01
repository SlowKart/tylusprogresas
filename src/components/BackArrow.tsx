import React from "react";

export function BackArrow({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="mr-2 p-2 rounded-full hover:bg-[#E8E9F1] focus:outline-none focus:ring-2 focus:ring-[#494A50]"
      style={{ lineHeight: 0 }}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="text-[#494A50]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}
