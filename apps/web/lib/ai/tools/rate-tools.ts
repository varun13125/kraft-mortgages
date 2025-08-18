import { firestore } from "@/lib/firebaseAdmin";
import { ToolResult, MortgageTool, Province } from "./types";

export interface RateData {
  lender: string;
  termMonths: number;
  rateAPR: number;
  province: string;
  capturedAt: Date;
}

export interface RateComparison {
  amount: number;
  term: number;
  rates: Array<{
    lender: string;
    rate: number;
    monthlyPayment: number;
    totalInterest: number;
    savings?: number;
  }>;
}

export interface RateParams {
  province?: string;
  termMonths?: number;
  loanAmount?: number;
  limit?: number;
}

export class RateTools {
  private static instance: RateTools;
  
  private constructor() {}
  
  static getInstance(): RateTools {
    if (!RateTools.instance) {
      RateTools.instance = new RateTools();
    }
    return RateTools.instance;
  }

  async getCurrentRates(params: RateParams = {}): Promise<ToolResult> {
    try {
      const {
        province = "BC",
        termMonths = 60, // 5 year default
        limit = 5
      } = params;

      const db = firestore();
      const ratesRef = db.collection("rateSnapshots");
      
      // Build query
      let query = ratesRef
        .where("province", "==", province)
        .where("termMonths", "==", termMonths)
        .orderBy("rateAPR", "asc")
        .limit(limit);

      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return {
          success: false,
          error: "No rates found for the specified criteria",
          displayType: "text",
          formattedResult: `No current rates available for ${province} with ${termMonths}-month term. Please try different criteria or contact us directly.`
        };
      }

      const rates: RateData[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        rates.push({
          lender: data.lender,
          termMonths: data.termMonths,
          rateAPR: data.rateAPR,
          province: data.province,
          capturedAt: data.capturedAt?.toDate() || new Date()
        });
      });

      const result = {
        province,
        termMonths,
        termYears: termMonths / 12,
        rateCount: rates.length,
        rates: rates.map(rate => ({
          lender: rate.lender,
          rate: rate.rateAPR,
          rateFormatted: `${rate.rateAPR.toFixed(2)}%`
        })),
        lastUpdated: rates[0]?.capturedAt,
        disclaimer: "Rates shown are for qualified borrowers and may vary based on individual circumstances."
      };

      return {
        success: true,
        data: result,
        displayType: "table",
        formattedResult: this.formatRateResults(result)
      };

    } catch (error) {
      console.error("Rate lookup error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Rate lookup failed",
        displayType: "text",
        formattedResult: "Unable to fetch current rates. Please try again or contact us directly at 604-593-1550."
      };
    }
  }

  async compareRates(params: RateParams & { loanAmount: number }): Promise<ToolResult> {
    try {
      const {
        province = "BC",
        termMonths = 60,
        loanAmount,
        limit = 5
      } = params;

      if (!loanAmount || loanAmount <= 0) {
        return {
          success: false,
          error: "Valid loan amount is required for comparison",
          displayType: "text",
          formattedResult: "Please provide a valid loan amount to compare payments."
        };
      }

      // Get current rates
      const ratesResult = await this.getCurrentRates({ province, termMonths, limit });
      
      if (!ratesResult.success || !ratesResult.data) {
        return ratesResult;
      }

      const rates = ratesResult.data.rates;
      const amortization = 25; // Standard amortization

      // Calculate payments for each rate
      const comparisons = rates.map((rateInfo: any, index: number) => {
        const monthlyRate = rateInfo.rate / 100 / 12;
        const numPayments = amortization * 12;
        
        let monthlyPayment: number;
        if (monthlyRate === 0) {
          monthlyPayment = loanAmount / numPayments;
        } else {
          monthlyPayment = loanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
            (Math.pow(1 + monthlyRate, numPayments) - 1);
        }
        
        const totalInterest = (monthlyPayment * numPayments) - loanAmount;
        const savings = index === 0 ? 0 : (comparisons?.[0]?.totalInterest || 0) - totalInterest;

        return {
          lender: rateInfo.lender,
          rate: rateInfo.rate,
          monthlyPayment: Math.round(monthlyPayment),
          totalInterest: Math.round(totalInterest),
          savings: Math.round(savings)
        };
      });

      const result = {
        loanAmount,
        termYears: termMonths / 12,
        amortization,
        province,
        comparisons,
        bestRate: comparisons[0],
        potentialSavings: comparisons[comparisons.length - 1]?.totalInterest - comparisons[0]?.totalInterest
      };

      return {
        success: true,
        data: result,
        displayType: "table",
        formattedResult: this.formatComparisonResults(result)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Rate comparison failed",
        displayType: "text",
        formattedResult: "Unable to compare rates. Please check your input values."
      };
    }
  }

  async getRateHistory(params: { province?: string; days?: number }): Promise<ToolResult> {
    try {
      const { province = "BC", days = 30 } = params;
      
      const db = firestore();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const snapshot = await db.collection("rateSnapshots")
        .where("province", "==", province)
        .where("capturedAt", ">=", cutoffDate)
        .orderBy("capturedAt", "desc")
        .limit(100)
        .get();

      if (snapshot.empty) {
        return {
          success: false,
          error: "No historical rate data found",
          displayType: "text",
          formattedResult: `No rate history available for ${province} in the last ${days} days.`
        };
      }

      const rateHistory: Array<{
        date: string;
        avgRate: number;
        minRate: number;
        maxRate: number;
        lenderCount: number;
      }> = [];

      // Group by date and calculate averages
      const ratesByDate = new Map();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        const dateKey = data.capturedAt.toDate().toDateString();
        
        if (!ratesByDate.has(dateKey)) {
          ratesByDate.set(dateKey, []);
        }
        ratesByDate.get(dateKey).push(data.rateAPR);
      });

      ratesByDate.forEach((rates, date) => {
        const avgRate = rates.reduce((sum: number, rate: number) => sum + rate, 0) / rates.length;
        const minRate = Math.min(...rates);
        const maxRate = Math.max(...rates);
        
        rateHistory.push({
          date,
          avgRate: Number(avgRate.toFixed(3)),
          minRate: Number(minRate.toFixed(3)),
          maxRate: Number(maxRate.toFixed(3)),
          lenderCount: rates.length
        });
      });

      // Sort by date (most recent first)
      rateHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const trend = this.calculateTrend(rateHistory);

      const result = {
        province,
        period: `${days} days`,
        history: rateHistory.slice(0, 10), // Last 10 data points
        trend,
        currentAvg: rateHistory[0]?.avgRate,
        periodLow: Math.min(...rateHistory.map(h => h.minRate)),
        periodHigh: Math.max(...rateHistory.map(h => h.maxRate))
      };

      return {
        success: true,
        data: result,
        displayType: "list",
        formattedResult: this.formatHistoryResults(result)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Rate history lookup failed",
        displayType: "text",
        formattedResult: "Unable to fetch rate history. Please try again later."
      };
    }
  }

  async getRateAlert(params: { targetRate: number; province?: string }): Promise<ToolResult> {
    try {
      const { targetRate, province = "BC" } = params;

      const currentRates = await this.getCurrentRates({ province, limit: 1 });
      
      if (!currentRates.success || !currentRates.data) {
        return currentRates;
      }

      const bestCurrentRate = currentRates.data.rates[0]?.rate;
      const isTargetMet = bestCurrentRate <= targetRate;
      const difference = bestCurrentRate - targetRate;

      const result = {
        targetRate,
        currentBestRate: bestCurrentRate,
        difference: Number(difference.toFixed(3)),
        isTargetMet,
        province,
        recommendation: isTargetMet 
          ? "Your target rate is available! Consider locking in now."
          : `Current best rate is ${difference.toFixed(2)}% above your target. We'll monitor for improvements.`
      };

      return {
        success: true,
        data: result,
        displayType: "card",
        formattedResult: this.formatRateAlert(result)
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Rate alert check failed",
        displayType: "text",
        formattedResult: "Unable to check rate alert. Please try again."
      };
    }
  }

  private calculateTrend(history: Array<{ avgRate: number }>): string {
    if (history.length < 2) return "insufficient data";
    
    const recent = history.slice(0, 3).reduce((sum, h) => sum + h.avgRate, 0) / 3;
    const older = history.slice(-3).reduce((sum, h) => sum + h.avgRate, 0) / 3;
    const difference = recent - older;
    
    if (Math.abs(difference) < 0.05) return "stable";
    return difference > 0 ? "rising" : "falling";
  }

  private formatRateResults(data: any): string {
    const { province, termYears, rates, lastUpdated } = data;
    
    let result = `**Current ${termYears}-Year Mortgage Rates in ${province}**\n\n`;
    
    rates.forEach((rate: any, index: number) => {
      const rank = index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : "";
      result += `${rank}**${rate.lender}**: ${rate.rateFormatted}\n`;
    });
    
    result += `\n*Last updated: ${lastUpdated?.toLocaleDateString() || "Recently"}*`;
    result += `\n*Rates for qualified borrowers and may vary based on individual circumstances.*`;
    
    return result;
  }

  private formatComparisonResults(data: any): string {
    const { loanAmount, termYears, amortization, comparisons, potentialSavings } = data;
    
    let result = `**Rate Comparison for $${loanAmount.toLocaleString()} Mortgage**\n`;
    result += `*${termYears}-year term, ${amortization}-year amortization*\n\n`;
    
    comparisons.forEach((comp: any, index: number) => {
      const rank = index === 0 ? "🥇 BEST: " : "";
      const savings = comp.savings > 0 ? ` (Save $${comp.savings.toLocaleString()})` : "";
      
      result += `${rank}**${comp.lender}**\n`;
      result += `  Rate: ${comp.rate.toFixed(2)}%\n`;
      result += `  Monthly: $${comp.monthlyPayment.toLocaleString()}\n`;
      result += `  Total Interest: $${comp.totalInterest.toLocaleString()}${savings}\n\n`;
    });
    
    if (potentialSavings > 0) {
      result += `💰 **Potential Savings**: Up to $${Math.abs(potentialSavings).toLocaleString()} by choosing the best rate!`;
    }
    
    return result;
  }

  private formatHistoryResults(data: any): string {
    const { province, period, trend, currentAvg, periodLow, periodHigh } = data;
    
    let result = `**${period} Rate History for ${province}**\n\n`;
    result += `📈 **Trend**: ${trend.toUpperCase()}\n`;
    result += `📊 **Current Average**: ${currentAvg?.toFixed(2)}%\n`;
    result += `📉 **Period Low**: ${periodLow.toFixed(2)}%\n`;
    result += `📈 **Period High**: ${periodHigh.toFixed(2)}%\n\n`;
    
    const trendEmoji = trend === "falling" ? "📉" : trend === "rising" ? "📈" : "➡️";
    result += `${trendEmoji} Rates have been **${trend}** over the past ${period}.`;
    
    return result;
  }

  private formatRateAlert(data: any): string {
    const { targetRate, currentBestRate, isTargetMet, difference, recommendation } = data;
    
    const status = isTargetMet ? "🎯 TARGET MET!" : "⏳ MONITORING";
    
    let result = `**Rate Alert Status: ${status}**\n\n`;
    result += `🎯 **Target Rate**: ${targetRate.toFixed(2)}%\n`;
    result += `💼 **Current Best**: ${currentBestRate?.toFixed(2)}%\n`;
    result += `📊 **Difference**: ${Math.abs(difference).toFixed(2)}% ${difference > 0 ? "above" : "below"} target\n\n`;
    result += `**Recommendation**: ${recommendation}`;
    
    return result;
  }
}

// Export individual tool functions as MortgageTool objects
export const rateTools: MortgageTool[] = [
  {
    name: "get_current_rates",
    description: "Get current mortgage rates",
    parameters: null,
    execute: async (params: any) => RateTools.getInstance().getCurrentRates(params)
  },
  {
    name: "compare_rates", 
    description: "Compare mortgage rates",
    parameters: null,
    execute: async (params: any) => RateTools.getInstance().compareRates(params)
  },
  {
    name: "get_rate_history",
    description: "Get historical rate data",
    parameters: null,
    execute: async (params: any) => RateTools.getInstance().getRateHistory(params)
  }
];

// Also export the class instance for direct use
export const rateToolsInstance = RateTools.getInstance();