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
    "flex flex-row justify-center items-center min-h-[40px] px-4 py-3 gap-2 font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-[#494A50]";
  let styles = "";
  switch (variant) {
    case "primary":
      styles =
        "bg-[#1F2024] text-white rounded-[12px] border-none hover:bg-[#494A50] active:bg-[#2F3036]";
      break;
    case "secondary":
      styles =
        "bg-white text-[#8F9098] border border-[#8F9098] border-[1.5px] rounded-[12px] hover:bg-[#F5F5F7] active:bg-[#E8E9F1]";
      break;
    case "tertiary":
      styles =
        "bg-transparent text-[#71727A] rounded-[8px] border-none hover:bg-[#F5F5F7] active:bg-[#E8E9F1]";
      break;
  }
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
};
