import React from "react";

export type ButtonVariant = "primary" | "secondary" | "tertiary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const base =
    "flex flex-row justify-center items-center min-h-[40px] px-4 py-3 gap-2 font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-blue-400";
  let styles = "";
  switch (variant) {
    case "primary":
      styles =
        "bg-[#006FFD] text-white rounded-[12px] border-none hover:bg-blue-700 active:bg-blue-800";
      break;
    case "secondary":
      styles =
        "bg-white text-[#006FFD] border border-[#006FFD] border-[1.5px] rounded-[12px] hover:bg-blue-50 active:bg-blue-100";
      break;
    case "tertiary":
      styles =
        "bg-transparent text-[#006FFD] rounded-[8px] border-none hover:bg-blue-50 active:bg-blue-100";
      break;
  }
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};
