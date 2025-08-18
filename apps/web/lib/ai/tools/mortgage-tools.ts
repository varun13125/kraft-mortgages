import { stressTestRate, gdsTds } from "@/lib/calc/affordability";
import { payment, biweeklySavings } from "@/lib/calc/payment";
import { cashflow } from "@/lib/calc/investment";
import { interestOnlyCost } from "@/lib/calc/construction";

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  displayType: "table" | "card" | "list" | "text";
  formattedResult: string;
}

export interface AffordabilityParams {
  income: number;
  debts: number;
  downPayment: number;
  rate: number;
  propertyTax?: number;
  heating?: number;
  condoFees?: number;
}

export interface PaymentParams {
  principal: number;
  rate: number;
  amortization: number;
  frequency?: "monthly" | "biweekly";
}

export interface InvestmentParams {
  price: number;
  downPayment: number;
  rate: number;
  amortization: number;
  rent: number;
  vacancy?: number;
  expenses: number;
}

export interface ConstructionParams {
  rate: number;
  draws: Array<{ month: number; amount: number }>;
}

export class MortgageTools {
  private static instance: MortgageTools;
  
  private constructor() {}
  
  static getInstance(): MortgageTools {
    if (!MortgageTools.instance) {
      MortgageTools.instance = new MortgageTools();
    }
    return MortgageTools.instance;
  }

  async calculateAffordability(params: AffordabilityParams): Promise<ToolResult> {
    try {
      const {
        income,
        debts,
        downPayment,
        rate,
        propertyTax = 3000,
        heating = 1200,
        condoFees = 0
      } = params;

      // Estimate property value from down payment (assuming 20% down)
      const estimatedPrice = downPayment / 0.2;
      const principal = estimatedPrice - downPayment;
      
      // Calculate stress test rate
      const qualRate = stressTestRate(rate);
      
      // Calculate monthly payment at stress test rate
      const monthlyPI = payment({
        principal,
        annualRatePct: qualRate,
        amortYears: 25,
        paymentsPerYear: 12
      });
      
      // Calculate total housing costs
      const housingAnnual = monthlyPI * 12 + propertyTax + heating + condoFees * 12;
      
      // Calculate ratios
      const ratios = gdsTds({
        incomeAnnual: income,
        housingCostsAnnual: housingAnnual,
        totalDebtAnnual: debts
      });
      
      const qualifies = ratios.gds <= 39 && ratios.tds <= 44;
      
      // Calculate maximum affordable amount
      const maxHousingPayment = (income * 0.39) / 12; // 39% GDS
      const maxPI = maxHousingPayment - (propertyTax + heating + condoFees * 12) / 12;
      
      // Reverse calculate maximum principal
      const maxPrincipal = this.calculateMaxPrincipal(maxPI, qualRate, 25);
      const maxPrice = maxPrincipal + downPayment;

      const result = {
        input: {
          income,
          debts,
          downPayment,
          rate,
          propertyTax,
          heating,
          condoFees
        },
        qualification: {
          stressTestRate: qualRate,
          monthlyPayment: monthlyPI,
          gdsRatio: ratios.gds,
          tdsRatio: ratios.tds,
          qualifies,
          maxAffordablePrice: maxPrice
        },
        breakdown: {
          monthlyPI: monthlyPI,
          monthlyPropertyTax: propertyTax / 12,
          monthlyHeating: heating / 12,
          monthlyCondoFees: condoFees,
          totalHousingCosts: housingAnnual / 12
        }
      };

      return {
        success: true,
        data: result,
        displayType: "card",
        formattedResult: this.formatAffordabilityResult(result)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Calculation failed",
        displayType: "text",
        formattedResult: "Unable to calculate affordability. Please check your input values."
      };
    }
  }

  async calculatePayment(params: PaymentParams): Promise<ToolResult> {
    try {
      const { principal, rate, amortization, frequency = "monthly" } = params;

      const monthlyPayment = payment({
        principal,
        annualRatePct: rate,
        amortYears: amortization,
        paymentsPerYear: 12
      });

      let result: any = {
        principal,
        rate,
        amortization,
        monthlyPayment,
        totalInterest: (monthlyPayment * 12 * amortization) - principal
      };

      if (frequency === "biweekly" || params.frequency === undefined) {
        // Calculate biweekly savings
        const biweeklyData = biweeklySavings({
          principal,
          annualRatePct: rate,
          amortYears: amortization
        });
        
        // Calculate time saved with bi-weekly payments
        const monthlyAnnualPayment = biweeklyData.monthly * 12;
        const biweeklyAnnualPayment = biweeklyData.acceleratedBiweekly * 26;
        const extraAnnualPayment = biweeklyAnnualPayment - monthlyAnnualPayment;
        const estimatedTimeSaved = extraAnnualPayment > 0 ? Math.round((extraAnnualPayment / monthlyAnnualPayment) * amortization * 10) / 10 : 0;
        
        result.biweekly = {
          payment: biweeklyData.acceleratedBiweekly,
          annualSavings: biweeklyData.annualSavings,
          timeSaved: estimatedTimeSaved
        };
      }

      return {
        success: true,
        data: result,
        displayType: "card",
        formattedResult: this.formatPaymentResult(result)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment calculation failed",
        displayType: "text",
        formattedResult: "Unable to calculate payment. Please check your input values."
      };
    }
  }

  async calculateInvestmentProperty(params: InvestmentParams): Promise<ToolResult> {
    try {
      const {
        price,
        downPayment,
        rate,
        amortization,
        rent,
        vacancy = 3,
        expenses
      } = params;

      const result = cashflow({
        price,
        downPayment,
        ratePct: rate,
        amortYears: amortization,
        rentMonthly: rent,
        vacancyPct: vacancy,
        expensesMonthly: expenses
      });

      const analysis = {
        property: {
          price,
          downPayment,
          mortgageAmount: price - downPayment
        },
        financing: {
          rate,
          amortization,
          monthlyPayment: result.pmt
        },
        income: {
          grossRent: rent,
          vacancyRate: vacancy,
          netRent: rent * (1 - vacancy / 100)
        },
        expenses: {
          monthlyExpenses: expenses,
          totalPayment: result.pmt
        },
        analysis: {
          noi: result.noi,
          cashFlow: result.cf,
          capRate: result.capRate,
          dscr: result.dscr,
          isGoodInvestment: result.cf > 0 && result.dscr >= 1.2 && result.capRate >= 4
        }
      };

      return {
        success: true,
        data: analysis,
        displayType: "table",
        formattedResult: this.formatInvestmentResult(analysis)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Investment calculation failed",
        displayType: "text",
        formattedResult: "Unable to calculate investment property analysis. Please check your input values."
      };
    }
  }

  async calculateConstructionCost(params: ConstructionParams): Promise<ToolResult> {
    try {
      const { rate, draws } = params;

      const result = interestOnlyCost({ draws, annualRatePct: rate });
      const totalProjectCost = draws.reduce((sum, draw) => sum + draw.amount, 0);
      const constructionPeriod = Math.max(...draws.map(d => d.month));

      const analysis = {
        project: {
          totalCost: totalProjectCost,
          constructionPeriod,
          interestRate: rate
        },
        financing: {
          totalInterest: result.totalInterest,
          monthlyAverage: result.totalInterest / constructionPeriod,
          percentOfProject: (result.totalInterest / totalProjectCost) * 100
        },
        draws: draws.map(draw => ({
          ...draw,
          interestAccrual: `Month ${draw.month}`
        }))
      };

      return {
        success: true,
        data: analysis,
        displayType: "card",
        formattedResult: this.formatConstructionResult(analysis)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Construction calculation failed",
        displayType: "text",
        formattedResult: "Unable to calculate construction costs. Please check your input values."
      };
    }
  }

  // Helper method to calculate max principal from payment
  private calculateMaxPrincipal(monthlyPayment: number, rate: number, years: number): number {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    
    if (monthlyRate === 0) {
      return monthlyPayment * numPayments;
    }
    
    return monthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
  }

  private formatAffordabilityResult(data: any): string {
    const { qualification, breakdown } = data;
    
    return `**Affordability Analysis**

**Qualification Results:**
- Stress Test Rate: ${qualification.stressTestRate.toFixed(2)}%
- Monthly Payment (P&I): $${qualification.monthlyPayment.toLocaleString()}
- GDS Ratio: ${qualification.gdsRatio.toFixed(1)}% (max 39%)
- TDS Ratio: ${qualification.tdsRatio.toFixed(1)}% (max 44%)
- **Status: ${qualification.qualifies ? "✅ QUALIFIED" : "❌ NEEDS ADJUSTMENT"}**

**Maximum Affordable Price: $${qualification.maxAffordablePrice.toLocaleString()}**

**Monthly Housing Costs:**
- Principal & Interest: $${breakdown.monthlyPI.toLocaleString()}
- Property Tax: $${breakdown.monthlyPropertyTax.toLocaleString()}
- Heating: $${breakdown.monthlyHeating.toLocaleString()}
- Condo Fees: $${breakdown.monthlyCondoFees.toLocaleString()}
- **Total: $${breakdown.totalHousingCosts.toLocaleString()}**`;
  }

  private formatPaymentResult(data: any): string {
    let result = `**Payment Calculation**

**Loan Details:**
- Principal: $${data.principal.toLocaleString()}
- Interest Rate: ${data.rate}%
- Amortization: ${data.amortization} years

**Monthly Payment: $${data.monthlyPayment.toLocaleString()}**
**Total Interest: $${data.totalInterest.toLocaleString()}**`;

    if (data.biweekly) {
      result += `

**Accelerated Bi-Weekly Option:**
- Bi-weekly Payment: $${data.biweekly.payment.toLocaleString()}
- Annual Savings: $${data.biweekly.annualSavings.toLocaleString()}
- Time Saved: ${data.biweekly.timeSaved} years`;
    }

    return result;
  }

  private formatInvestmentResult(data: any): string {
    const { property, analysis } = data;
    
    return `**Investment Property Analysis**

**Property Details:**
- Purchase Price: $${property.price.toLocaleString()}
- Down Payment: $${property.downPayment.toLocaleString()}
- Mortgage Amount: $${property.mortgageAmount.toLocaleString()}

**Financial Performance:**
- Net Operating Income: $${analysis.noi.toLocaleString()}/month
- Cash Flow: $${analysis.cashFlow.toLocaleString()}/month
- Cap Rate: ${analysis.capRate.toFixed(2)}%
- DSCR: ${analysis.dscr.toFixed(2)}

**Investment Rating: ${analysis.isGoodInvestment ? "✅ STRONG INVESTMENT" : "⚠️ REQUIRES REVIEW"}**

${analysis.isGoodInvestment 
  ? "This property shows positive cash flow with healthy debt coverage." 
  : "Consider adjusting purchase price, down payment, or rental income."}`;
  }

  private formatConstructionResult(data: any): string {
    const { project, financing } = data;
    
    return `**Construction Financing Analysis**

**Project Details:**
- Total Project Cost: $${project.totalCost.toLocaleString()}
- Construction Period: ${project.constructionPeriod} months
- Interest Rate: ${project.interestRate}%

**Interest Costs:**
- Total Interest During Construction: $${financing.totalInterest.toLocaleString()}
- Average Monthly Interest: $${financing.monthlyAverage.toLocaleString()}
- Interest as % of Project: ${financing.percentOfProject.toFixed(2)}%

**Note:** Interest is calculated on funds drawn during construction. Final costs depend on actual draw timing and lender terms.`;
  }
}

export const mortgageTools = MortgageTools.getInstance();