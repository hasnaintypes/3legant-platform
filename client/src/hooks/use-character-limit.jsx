import { useState } from "react";

export function useCharacterLimit({ maxLength, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);
  const characterCount = value.length;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      setValue(newValue);
    }
  };

  return {
    value,
    setValue,
    characterCount,
    handleChange,
    maxLength,
  };
}
