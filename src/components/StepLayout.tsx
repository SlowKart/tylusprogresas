import React from "react";
import { SkipBack } from "lucide-react";
import { IconButton } from "./ui/IconButton";
import { AppContainer } from "./AppContainer";

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
    <AppContainer>
      <div className="flex items-center mb-8 w-full">
        {onBack && (
          <IconButton onClick={onBack} label="Back">
            <SkipBack
              size={24}
              strokeWidth={2}
              className="text-primary"
              aria-hidden="true"
            />
          </IconButton>
        )}
        <h1 className="text-3xl font-bold text-primary ml-2">{title}</h1>
      </div>
      <div className="flex-1 flex flex-col justify-center w-full">
        {children}
      </div>
    </AppContainer>
  );
}
