import React from "react";
import { SkipBack } from "lucide-react";

export function StepLayout({
  children,
  onBack,
  title,
}: {
  children: React.ReactNode;
  onBack?: () => void;
  title: string;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="flex items-center mb-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="mr-2 p-2 rounded-full hover:bg-[#E8E9F1] focus:outline-none focus:ring-2 focus:ring-[#494A50]"
            style={{ lineHeight: 0 }}
          >
            <SkipBack
              size={24}
              strokeWidth={2}
              className="text-[#494A50]"
              aria-hidden="true"
            />
          </button>
        )}
        <h1 className="text-3xl font-bold text-[#1F2024]">{title}</h1>
      </div>
      {children}
    </main>
  );
}
