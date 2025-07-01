import React from "react";
import { BackArrow } from "./BackArrow";

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
        {onBack && <BackArrow onClick={onBack} />}
        <h1 className="text-3xl font-bold text-[#1F2024]">{title}</h1>
      </div>
      {children}
    </main>
  );
}
