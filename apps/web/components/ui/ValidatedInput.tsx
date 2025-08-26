"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, DollarSign, Percent } from "lucide-react";
import { validateNumericInput, ValidationRule } from "@/lib/utils/validation";

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
  const [localValue, setLocalValue] = useState(value.toString());
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (inputValue: string) => {
    setLocalValue(inputValue);
    
    const result = validateNumericInput(inputValue, validation);
    
    if (result.isValid) {
      setError(null);
      onChange(result.value);
    } else if (touched) {
      setError(result.message || null);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const result = validateNumericInput(localValue, validation);
    
    if (!result.isValid) {
      setError(result.message || null);
    } else {
      setError(null);
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    if (type === 'currency') return <DollarSign className="w-4 h-4 text-gold-400" />;
    if (type === 'percentage') return <Percent className="w-4 h-4 text-gold-400" />;
    return null;
  };

  const getSuffix = () => {
    if (type === 'percentage') return '%';
    return null;
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        {getIcon()}
        {label}
      </label>
      <div className="relative">
        {type === 'currency' && (
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
        )}
        <input
          type="number"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full py-3 px-4 bg-white/5 border rounded-xl transition-colors text-white placeholder-gray-400
            focus:ring-2 focus:ring-gold-400/20 focus:outline-none
            ${type === 'currency' ? 'pl-8' : ''}
            ${getSuffix() ? 'pr-8' : ''}
            ${error ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-gold-400'}
            text-base sm:text-sm
          `}
          min={validation.min}
          max={validation.max}
          step={validation.step}
        />
        {getSuffix() && (
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {getSuffix()}
          </span>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {help && !error && (
        <p className="text-xs text-gray-400 mt-1">{help}</p>
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
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      <div className="space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-sm text-gray-400">
          <span>{formatValue ? formatValue(min) : min}</span>
          <span className="font-semibold text-gold-400">{displayValue}</span>
          <span>{formatValue ? formatValue(max) : max}</span>
        </div>
      </div>
    </div>
  );
}