"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon, PhoneIcon } from "lucide-react";
import { useId, useState, useEffect } from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

export function PhoneInput({ initialPhone = "", onPhoneChange }) {
  const id = useId();
  const [value, setValue] = useState(initialPhone);

  // Update local state when initialPhone prop changes
  useEffect(() => {
    if (initialPhone) {
      setValue(initialPhone);
    }
  }, [initialPhone]);

  // Handle phone number changes
  const handlePhoneChange = (newValue) => {
    const phoneValue = newValue ?? "";
    setValue(phoneValue);

    // Call the parent component's callback if provided
    if (onPhoneChange) {
      onPhoneChange(phoneValue);
    }
  };

  return (
    <div className="space-y-2" dir="ltr">
      <Label htmlFor={id}>Phone number</Label>
      <RPNInput.default
        className="flex rounded-md shadow-xs"
        international
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInputComponent}
        id={id}
        placeholder="Enter phone number"
        value={value}
        onChange={handlePhoneChange}
      />
    </div>
  );
}

const PhoneInputComponent = ({ className, ...props }) => {
  return (
    <Input
      data-slot="phone-input"
      className={cn(
        "-ms-px rounded-s-none shadow-none focus-visible:z-10",
        className
      )}
      {...props}
    />
  );
};

PhoneInputComponent.displayName = "PhoneInputComponent";

const CountrySelect = ({ disabled, value, onChange, options }) => {
  const handleSelect = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="border-input bg-background text-muted-foreground focus-within:border-ring focus-within:ring-ring/50 hover:bg-accent hover:text-foreground has-aria-invalid:border-destructive/60 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 relative inline-flex items-center self-stretch rounded-s-md border py-2 ps-3 pe-2 transition-[color,box-shadow] outline-none focus-within:z-10 focus-within:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        <span className="text-muted-foreground/80">
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 text-sm opacity-0"
        aria-label="Select country"
      >
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label}{" "}
              {option.value &&
                `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <PhoneIcon size={16} aria-hidden="true" />
      )}
    </span>
  );
};
