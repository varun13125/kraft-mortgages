/**
 * Validation utilities for calculator inputs
 */

export interface ValidationRule {
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  value: number;
}

/**
 * Validate a numeric input with given rules
 */
export function validateNumericInput(
  value: string | number,
  rules: ValidationRule = {}
): ValidationResult {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if value is a valid number
  if (isNaN(numValue)) {
    return {
      isValid: false,
      message: rules.message || 'Please enter a valid number',
      value: 0
    };
  }

  // Check required
  if (rules.required && numValue === 0) {
    return {
      isValid: false,
      message: rules.message || 'This field is required',
      value: numValue
    };
  }

  // Check minimum value
  if (rules.min !== undefined && numValue < rules.min) {
    return {
      isValid: false,
      message: rules.message || `Minimum value is ${rules.min.toLocaleString()}`,
      value: numValue
    };
  }

  // Check maximum value
  if (rules.max !== undefined && numValue > rules.max) {
    return {
      isValid: false,
      message: rules.message || `Maximum value is ${rules.max.toLocaleString()}`,
      value: numValue
    };
  }

  return {
    isValid: true,
    value: numValue
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format number with proper rounding
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-CA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Common validation rules for different input types
 */
export const validationRules = {
  income: {
    min: 30000,
    max: 1000000,
    message: 'Income must be between $30,000 and $1,000,000'
  },
  homeValue: {
    min: 100000,
    max: 10000000,
    message: 'Home value must be between $100,000 and $10,000,000'
  },
  downPayment: {
    min: 0.05,
    max: 0.50,
    message: 'Down payment must be between 5% and 50%'
  },
  interestRate: {
    min: 2.0,
    max: 15.0,
    message: 'Interest rate must be between 2% and 15%'
  },
  creditScore: {
    min: 300,
    max: 850,
    message: 'Credit score must be between 300 and 850'
  },
  monthlyDebts: {
    min: 0,
    max: 10000,
    message: 'Monthly debts cannot exceed $10,000'
  },
  amortization: {
    min: 5,
    max: 35,
    message: 'Amortization must be between 5 and 35 years'
  }
};