import React from "react";
import { Squircle } from "@squircle-js/react";

interface ButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  text: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, type = "button", text, className = "" }) => {
  return (
    <Squircle asChild cornerRadius={14} cornerSmoothing={0.6}>
      <button onClick={onClick} type={type} className={`button ${className}`}>
        {text}
      </button>
    </Squircle>
  );
};
