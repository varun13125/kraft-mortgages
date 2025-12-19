import { mortgageTools } from "./mortgage-tools";
import { rateTools } from "./rate-tools";
import { documentTools } from "./document-tools";
import { appointmentTools } from "./appointment-tools";
import { navigationTools } from "./navigation-tools";
import { calculatorTools } from "./calculator-tools";
import { blogSearchTools } from "./blog-search-tools";
import { leadCaptureTools } from "./lead-capture-tools";
import { webSearchTools } from "./web-search-tools";
import { MortgageTool } from "./types";

export interface ToolExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  toolName: string;
  displayType?: "table" | "card" | "list" | "text" | "chart";
  formattedResult?: string;
}

class ToolExecutor {
  private static instance: ToolExecutor;
  private tools: Map<string, MortgageTool>;

  private constructor() {
    this.tools = new Map();
    this.registerTools();
  }

  static getInstance(): ToolExecutor {
    if (!ToolExecutor.instance) {
      ToolExecutor.instance = new ToolExecutor();
    }
    return ToolExecutor.instance;
  }

  private registerTools() {
    // Register all rate tools
    rateTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    // Register all document tools
    documentTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    // Register all appointment tools
    appointmentTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    // Register mortgage calculator tools (legacy format)
    const legacyCalculatorTools = [
      {
        name: "calculate_affordability",
        description: "Calculate how much home you can afford",
        parameters: null,
        execute: async (params: any) => mortgageTools.calculateAffordability(params)
      },
      {
        name: "calculate_payment",
        description: "Calculate mortgage payment",
        parameters: null,
        execute: async (params: any) => mortgageTools.calculatePayment(params)
      },
      {
        name: "calculate_investment",
        description: "Analyze investment property",
        parameters: null,
        execute: async (params: any) => mortgageTools.calculateInvestmentProperty(params)
      },
      {
        name: "calculate_construction",
        description: "Calculate construction financing",
        parameters: null,
        execute: async (params: any) => mortgageTools.calculateConstructionCost(params)
      }
    ];

    legacyCalculatorTools.forEach(tool => {
      this.tools.set(tool.name, tool as MortgageTool);
    });

    // Register navigation tools
    navigationTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    // Register new calculator tools (cap rate, NOI, refinance, etc.)
    calculatorTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    // Register blog search tools
    blogSearchTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    // Register lead capture tools (form prefill, callback)
    leadCaptureTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    // Register web search tools
    webSearchTools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  async executeTool(toolName: string, parameters: any): Promise<ToolExecutionResult> {
    const tool = this.tools.get(toolName);

    if (!tool) {
      return {
        success: false,
        error: `Tool "${toolName}" not found`,
        toolName
      };
    }

    try {
      // Validate parameters if schema is provided
      if (tool.parameters) {
        const validationResult = tool.parameters.safeParse(parameters);
        if (!validationResult.success) {
          return {
            success: false,
            error: `Invalid parameters: ${validationResult.error.message}`,
            toolName
          };
        }
        parameters = validationResult.data;
      }

      // Execute the tool
      const result = await tool.execute(parameters);

      return {
        success: true,
        data: result.data || result,
        toolName,
        displayType: result.displayType || "text",
        formattedResult: result.formattedResult || this.formatResult(result)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Tool execution failed",
        toolName
      };
    }
  }

  getAvailableTools(): Array<{ name: string; description: string }> {
    return Array.from(this.tools.entries()).map(([name, tool]) => ({
      name,
      description: tool.description
    }));
  }

  getToolSchema(toolName: string): any {
    const tool = this.tools.get(toolName);
    if (!tool) return null;

    // Handle parameters - check if it's a ZodObject with shape property
    let parameterSchema: any = {};
    if (tool.parameters) {
      // Check if it's a ZodObject (which has _def.shape)
      const params = tool.parameters as any;
      if (params._def && params._def.shape) {
        parameterSchema = params._def.shape;
      } else if (params.shape) {
        parameterSchema = params.shape;
      }
      // Otherwise leave as empty object for other Zod types
    }

    return {
      name: tool.name,
      description: tool.description,
      parameters: parameterSchema
    };
  }

  private formatResult(result: any): string {
    if (typeof result === "string") return result;
    if (result.formattedResult) return result.formattedResult;
    if (result.data) {
      if (typeof result.data === "string") return result.data;
      return JSON.stringify(result.data, null, 2);
    }
    return JSON.stringify(result, null, 2);
  }

  // Tool discovery for AI
  getToolsForIntent(intent: string): string[] {
    const intentKeywords = {
      affordability: ["afford", "qualify", "income", "budget", "how much"],
      payment: ["payment", "monthly", "biweekly", "calculate payment"],
      rates: ["rate", "interest", "current rate", "best rate", "compare"],
      documents: ["document", "paperwork", "required", "checklist", "upload"],
      appointment: ["book", "schedule", "appointment", "meeting", "consultation"],
      investment: ["investment", "rental", "property", "cash flow", "roi"],
      construction: ["construction", "build", "develop", "construction loan"]
    };

    const matchedTools: string[] = [];
    const lowerIntent = intent.toLowerCase();

    for (const [category, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => lowerIntent.includes(keyword))) {
        switch (category) {
          case "affordability":
            matchedTools.push("calculate_affordability");
            break;
          case "payment":
            matchedTools.push("calculate_payment");
            break;
          case "rates":
            matchedTools.push("get_current_rates", "compare_rates", "get_rate_history");
            break;
          case "documents":
            matchedTools.push("check_documents", "document_upload_guide", "document_timeline");
            break;
          case "appointment":
            matchedTools.push("check_availability", "book_appointment", "appointment_prep");
            break;
          case "investment":
            matchedTools.push("calculate_investment");
            break;
          case "construction":
            matchedTools.push("calculate_construction");
            break;
        }
      }
    }

    return [...new Set(matchedTools)];
  }
}

export const toolExecutor = ToolExecutor.getInstance();