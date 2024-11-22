import React from "react";
import { Squircle } from "@squircle-js/react";

interface InputProps {
  onChange: any;
  value: string;
  type: string;
  id?: string;
  name?: string;
  placeholder?: string;
  isError?: boolean;
}

export const Input: React.FC<InputProps> = (props) => {
  const inputClassName = props.isError ? "error_input" : "input";

  return (
    <Squircle asChild cornerRadius={14} cornerSmoothing={0.6}>
      <input onChange={props.onChange} value={props.value} type={props.type} id={props.id} name={props.name} placeholder={props.placeholder} className={inputClassName} />
    </Squircle>
  );
};
