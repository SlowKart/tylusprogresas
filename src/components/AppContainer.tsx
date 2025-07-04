import { ReactNode } from "react";

interface AppContainerProps {
  children: ReactNode;
  className?: string;
}

export function AppContainer({ children, className = "" }: AppContainerProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-background ${className}`}>
      <div className="w-full max-w-[400px] px-4 py-8">
        <div className="w-full max-w-[360px] mx-auto min-h-[500px] flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}