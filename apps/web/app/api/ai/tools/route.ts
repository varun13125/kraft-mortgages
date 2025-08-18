import { NextRequest } from "next/server";
import { mortgageTools } from "@/lib/ai/tools/mortgage-tools";
import { rateToolsInstance } from "@/lib/ai/tools/rate-tools";

export async function POST(req: NextRequest) {
  try {
    const { tool, parameters } = await req.json();

    if (!tool || !parameters) {
      return new Response(
        JSON.stringify({ error: "Tool and parameters are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let result;

    switch (tool) {
      case "calculateAffordability":
        result = await mortgageTools.calculateAffordability(parameters);
        break;
      
      case "calculatePayment":
        result = await mortgageTools.calculatePayment(parameters);
        break;
      
      case "calculateInvestment":
        result = await mortgageTools.calculateInvestmentProperty(parameters);
        break;
      
      case "calculateConstruction":
        result = await mortgageTools.calculateConstructionCost(parameters);
        break;
      
      case "getCurrentRates":
        result = await rateToolsInstance.getCurrentRates(parameters);
        break;
      
      case "compareRates":
        result = await rateToolsInstance.compareRates(parameters);
        break;
      
      case "getRateHistory":
        result = await rateToolsInstance.getRateHistory(parameters);
        break;
      
      case "getRateAlert":
        result = await rateToolsInstance.getRateAlert(parameters);
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: `Unknown tool: ${tool}` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    return new Response(
      JSON.stringify({
        tool,
        parameters,
        result,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Tool execution error:", error);
    
    return new Response(
      JSON.stringify({
        error: "Tool execution failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Return available tools
    const availableTools = {
      mortgageTools: [
        {
          name: "calculateAffordability",
          description: "Calculate mortgage affordability based on income and debts",
          parameters: ["income", "debts", "downPayment", "rate", "propertyTax?", "heating?", "condoFees?"]
        },
        {
          name: "calculatePayment",
          description: "Calculate monthly mortgage payments",
          parameters: ["principal", "rate", "amortization", "frequency?"]
        },
        {
          name: "calculateInvestment", 
          description: "Analyze investment property cash flow and returns",
          parameters: ["price", "downPayment", "rate", "amortization", "rent", "vacancy?", "expenses"]
        },
        {
          name: "calculateConstruction",
          description: "Calculate construction loan interest costs",
          parameters: ["rate", "draws"]
        }
      ],
      rateTools: [
        {
          name: "getCurrentRates",
          description: "Get current mortgage rates by province and term",
          parameters: ["province?", "termMonths?", "limit?"]
        },
        {
          name: "compareRates",
          description: "Compare payment calculations across different rates",
          parameters: ["loanAmount", "province?", "termMonths?", "limit?"]
        },
        {
          name: "getRateHistory",
          description: "Get historical rate trends",
          parameters: ["province?", "days?"]
        },
        {
          name: "getRateAlert",
          description: "Check if target rate is available",
          parameters: ["targetRate", "province?"]
        }
      ]
    };

    return new Response(
      JSON.stringify({
        availableTools,
        usage: "POST to this endpoint with { tool: 'toolName', parameters: {...} }",
        examples: {
          affordability: {
            tool: "calculateAffordability",
            parameters: {
              income: 120000,
              debts: 6000,
              downPayment: 100000,
              rate: 5.34
            }
          },
          rates: {
            tool: "getCurrentRates",
            parameters: {
              province: "BC",
              termMonths: 60
            }
          }
        }
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to get tool information" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}