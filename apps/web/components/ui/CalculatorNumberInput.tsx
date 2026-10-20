"use client";
import { useEffect, useId, useState, type InputHTMLAttributes } from "react";
import { validateNumericInput } from "@/lib/utils/validation";

/** A drop-in numeric input: invalid drafts never enter calculator state. */
export default function CalculatorNumberInput({
  value, onChange, onBlur, onFocus, min = 0, max = 1_000_000_000,
  allowEmpty = false, ...props
}: InputHTMLAttributes<HTMLInputElement> & { allowEmpty?: boolean }) {
  const generatedId = useId();
  const id = props.id ?? generatedId;
  const [draft, setDraft] = useState(String(value ?? ""));
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => {
    if (!focused && !error) setDraft(String(value ?? ""));
  }, [value, focused, error]);
  return (
    <>
      <input {...props} id={id} type="number" inputMode="decimal" min={min} max={max}
        value={draft} aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : props["aria-describedby"]}
        onFocus={event => { setFocused(true); onFocus?.(event); }}
        onBlur={event => { setFocused(false); onBlur?.(event); }}
        onChange={event => {
          const text = event.target.value;
          setDraft(text);
          const result = validateNumericInput(text, { min: Number(min), max: Number(max) });
          if (result.isValid || (allowEmpty && text === "")) {
            setError(undefined);
            onChange?.(event);
          } else setError(result.message);
        }}
      />
      {error && <p id={`${id}-error`} role="status" className="mt-2 text-sm text-amber-200">
        {error}. Results use the last valid value ({String(value ?? "automatic")}).
      </p>}
    </>
  );
}
