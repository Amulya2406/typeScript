import React, { forwardRef } from "react";

const InputBar = forwardRef<
  HTMLInputElement,
  {
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string | number;
  }
>(({ type, placeholder, onChange, value }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
});

export default InputBar;
