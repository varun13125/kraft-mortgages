"use client";
import { useState, useEffect, useId } from "react";
import { AlertTriangle, DollarSign, Percent } from "lucide-react";
import { validateNumericInput, ValidationRule, formatCurrency } from "@/lib/utils/validation";

interface ValidatedInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  validation?: ValidationRule;
  type?: 'currency' | 'percentage' | 'number';
  icon?: React.ReactNode;
  placeholder?: string;
  className?: string;
  help?: string;
}

export function ValidatedInput({
  label,
  value,
  onChange,
  validation = {},
  type = 'number',
  icon,
  placeholder,
  className = "",
  help
}: ValidatedInputProps) {
  const id = useId();
  const [localValue, setLocalValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused && !error) setLocalValue(value.toString());
  }, [value, focused, error]);

  const handleChange = (inputValue: string) => {
    setLocalValue(inputValue);
    const result = validateNumericInput(inputValue, validation);
    if (result.isValid) {
      setError(null);
      onChange(result.value);
    } else {
      setError(result.message || null);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    const result = validateNumericInput(localValue, validation);
    if (!result.isValid) {
      setError(result.message || null);
    } else {
      setError(null);
      // Format the value nicely on blur (e.g., "700000" → "700000")
      setLocalValue(result.value.toString());
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    if (type === 'currency') return <DollarSign className="w-4 h-4 text-gold-300" />;
    if (type === 'percentage') return <Percent className="w-4 h-4 text-gold-300" />;
    return null;
  };

  const getSuffix = () => {
    if (type === 'percentage') return '%';
    return null;
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-300">
        {getIcon()}
        <span>{label}</span>
      </label>
      <div className="relative">
        {type === 'currency' && (
          <span className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors pointer-events-none ${focused ? 'text-gold-300' : ''}`}>$</span>
        )}
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error ${id}-value` : help ? `${id}-help` : undefined}
          type="number"
          inputMode="decimal"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full py-3.5 sm:py-3 px-4 rounded-xl transition-all text-white placeholder-gray-500
            bg-gray-800/60 border
            ${type === 'currency' ? 'pl-8 sm:pl-9' : ''}
            ${getSuffix() ? 'pr-10' : ''}
            ${error
              ? 'border-red-400/60 focus:border-red-400'
              : focused
                ? 'border-gold-400/80 bg-gray-800/80 shadow-[0_0_0_3px_rgba(212,175,55,0.12)]'
                : 'border-gray-600/80 hover:border-gray-500'
            }
            text-base sm:text-sm
            outline-none
            appearance-none
            -moz-appearance:textfield
            [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
          `}
          min={validation.min}
          max={validation.max}
          step={validation.step}
        />
        {getSuffix() && (
          <span className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors ${focused ? 'text-gold-300' : ''}`}>
            {getSuffix()}
          </span>
        )}
      </div>
      {error && (
        <div id={`${id}-error`} className="flex items-center gap-2 mt-2 text-red-300 text-sm" role="status">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {error && localValue !== value.toString() && (
        // Invalid entries are never passed to onChange, so make it explicit which value results use
        <p id={`${id}-value`} className="text-xs text-gray-400 mt-1">
          Results are using the last valid value ({type === 'currency' ? formatCurrency(value) : type === 'percentage' ? `${value}%` : value.toLocaleString('en-CA')}).
        </p>
      )}
      {help && !error && (
        <p id={`${id}-help`} className="text-xs text-gray-400 mt-1.5 leading-relaxed">{help}</p>
      )}
    </div>
  );
}

interface ValidatedSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function ValidatedSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  formatValue,
  className = ""
}: ValidatedSliderProps) {
  const id = useId();
  const displayValue = formatValue ? formatValue(value) : value.toString();
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-2.5">
        <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-base sm:text-lg font-semibold text-gold-300 tabular-nums">{displayValue}</span>
      </div>
      <div className="relative pt-1 pb-1">
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full bg-gray-700/80 pointer-events-none" />
        {/* Filled portion */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 pointer-events-none"
          style={{ width: `${pct}%` }}
        />
        <input
          id={id}
          aria-valuetext={displayValue}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="kraft-slider relative w-full appearance-none bg-transparent cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1 tabular-nums">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}
