import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CharacterLimitTextarea({
  label,
  maxLength,
  value,
  onChange,
  placeholder,
}) {
  const id = useId();
  const characterCount = value?.length || 180;

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        placeholder={placeholder}
        aria-describedby={`${id}-description`}
      />
      <p
        id={`${id}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{maxLength - characterCount}</span>{" "}
        characters left
      </p>
    </div>
  );
}
