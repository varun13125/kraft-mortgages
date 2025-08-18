import { z } from "zod";

// Base interface for all mortgage tools
export interface MortgageTool {
  name: string;
  description: string;
  parameters: z.ZodSchema<any> | null;
  execute: (params: any) => Promise<ToolResult>;
}

// Tool execution result
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  displayType?: "table" | "card" | "list" | "text" | "chart";
  formattedResult?: string;
}

// Common parameter types
export interface CalculationParams {
  [key: string]: number | string | boolean;
}

// Contact information interface
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

// Appointment types
export type AppointmentType = "consultation" | "application" | "review" | "signing";

// Document types for mortgage applications
export type DocumentType = "income" | "identification" | "property" | "financial";

// Mortgage types
export type MortgageType = "purchase" | "refinance" | "renewal";

// Provinces supported
export type Province = "BC" | "AB" | "ON";

// Tool categories for organization
export type ToolCategory = "calculator" | "rate" | "document" | "appointment" | "report";