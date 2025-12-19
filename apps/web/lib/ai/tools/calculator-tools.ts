/**
 * Calculator Tools for AI Chatbot
 * Allows AI to execute calculations directly in the chat
 */

import { MortgageTool } from './types';

export class CalculatorTools {
    private static instance: CalculatorTools;

    static getInstance(): CalculatorTools {
        if (!CalculatorTools.instance) {
            CalculatorTools.instance = new CalculatorTools();
        }
        return CalculatorTools.instance;
    }

    /**
     * Calculate Cap Rate
     */
    calculateCapRate(params: { noi: number; marketValue: number }): {
        capRate: number;
        formatted: string;
        warning?: string;
    } {
        const { noi, marketValue } = params;
        const capRate = (noi / marketValue) * 100;

        let warning: string | undefined;
        if (capRate < 3) {
            warning = '⚠️ This cap rate is below 3%, which is below market average for most BC regions.';
        } else if (capRate > 10) {
            warning = '⚠️ Cap rate above 10% may indicate higher risk or value-add opportunity.';
        }

        return {
            capRate: Math.round(capRate * 100) / 100,
            formatted: `**Cap Rate: ${capRate.toFixed(2)}%**\n\nFormula: NOI ($${noi.toLocaleString()}) ÷ Market Value ($${marketValue.toLocaleString()}) × 100`,
            warning,
        };
    }

    /**
     * Calculate NOI
     */
    calculateNOI(params: {
        grossRent: number;
        otherIncome?: number;
        vacancyRate?: number;
        expenses: number;
    }): {
        noi: number;
        effectiveGrossIncome: number;
        expenseRatio: number;
        formatted: string;
    } {
        const { grossRent, otherIncome = 0, vacancyRate = 5, expenses } = params;

        const grossPotentialIncome = grossRent + otherIncome;
        const vacancyLoss = grossPotentialIncome * (vacancyRate / 100);
        const effectiveGrossIncome = grossPotentialIncome - vacancyLoss;
        const noi = effectiveGrossIncome - expenses;
        const expenseRatio = (expenses / effectiveGrossIncome) * 100;

        return {
            noi,
            effectiveGrossIncome,
            expenseRatio: Math.round(expenseRatio * 10) / 10,
            formatted: `**Net Operating Income: $${noi.toLocaleString()}**

| Item | Amount |
|------|--------|
| Gross Potential Income | $${grossPotentialIncome.toLocaleString()} |
| Less: Vacancy (${vacancyRate}%) | -$${Math.round(vacancyLoss).toLocaleString()} |
| Effective Gross Income | $${Math.round(effectiveGrossIncome).toLocaleString()} |
| Operating Expenses | -$${expenses.toLocaleString()} |
| **NOI** | **$${noi.toLocaleString()}** |

Expense Ratio: ${expenseRatio.toFixed(1)}%`,
        };
    }

    /**
     * Calculate Monthly Mortgage Payment
     */
    calculatePayment(params: {
        principal: number;
        rate: number;
        amortizationYears: number;
    }): {
        monthlyPayment: number;
        totalInterest: number;
        totalCost: number;
        formatted: string;
    } {
        const { principal, rate, amortizationYears } = params;

        const monthlyRate = rate / 100 / 12;
        const numPayments = amortizationYears * 12;

        const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
        const totalCost = monthlyPayment * numPayments;
        const totalInterest = totalCost - principal;

        return {
            monthlyPayment: Math.round(monthlyPayment * 100) / 100,
            totalInterest: Math.round(totalInterest),
            totalCost: Math.round(totalCost),
            formatted: `**Monthly Payment: $${monthlyPayment.toFixed(2)}**

| Detail | Amount |
|--------|--------|
| Principal | $${principal.toLocaleString()} |
| Interest Rate | ${rate}% |
| Amortization | ${amortizationYears} years |
| Monthly Payment | $${monthlyPayment.toFixed(2)} |
| Total Interest | $${totalInterest.toLocaleString()} |
| Total Cost | $${totalCost.toLocaleString()} |`,
        };
    }

    /**
     * Calculate Affordability
     */
    calculateAffordability(params: {
        annualIncome: number;
        downPayment: number;
        monthlyDebts?: number;
        rate?: number;
    }): {
        maxMortgage: number;
        maxPurchasePrice: number;
        monthlyPayment: number;
        formatted: string;
    } {
        const { annualIncome, downPayment, monthlyDebts = 0, rate = 5.5 } = params;

        // GDS limit is 39%, TDS limit is 44%
        const monthlyIncome = annualIncome / 12;
        const maxHousingCost = monthlyIncome * 0.39;
        const maxTotalDebt = monthlyIncome * 0.44;

        // Available for mortgage payment (after debts)
        const availableForMortgage = Math.min(maxHousingCost, maxTotalDebt - monthlyDebts);

        // Convert to mortgage amount (25 year amortization, stress test rate +2%)
        const stressTestRate = (rate + 2) / 100 / 12;
        const numPayments = 25 * 12;

        const maxMortgage = availableForMortgage * (Math.pow(1 + stressTestRate, numPayments) - 1) / (stressTestRate * Math.pow(1 + stressTestRate, numPayments));
        const maxPurchasePrice = maxMortgage + downPayment;

        // Actual monthly payment at contract rate
        const monthlyRate = rate / 100 / 12;
        const monthlyPayment = maxMortgage * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

        return {
            maxMortgage: Math.round(maxMortgage),
            maxPurchasePrice: Math.round(maxPurchasePrice),
            monthlyPayment: Math.round(monthlyPayment),
            formatted: `**You could afford a home up to ~$${Math.round(maxPurchasePrice / 1000) * 1000 / 1000}K**

| Calculation | Amount |
|-------------|--------|
| Annual Income | $${annualIncome.toLocaleString()} |
| Down Payment | $${downPayment.toLocaleString()} |
| Max Mortgage | ~$${Math.round(maxMortgage).toLocaleString()} |
| Max Purchase Price | ~$${Math.round(maxPurchasePrice).toLocaleString()} |
| Estimated Monthly Payment | ~$${Math.round(monthlyPayment).toLocaleString()} |

*Based on ${rate}% rate, 25-year amortization, stress tested at ${rate + 2}%*`,
        };
    }

    /**
     * Calculate Break-Even for Refinance
     */
    calculateRefinanceBreakEven(params: {
        currentBalance: number;
        currentRate: number;
        newRate: number;
        remainingTermMonths: number;
        penaltyAmount?: number;
        closingCosts?: number;
    }): {
        monthlySavings: number;
        breakEvenMonths: number;
        fiveYearSavings: number;
        formatted: string;
        recommendation: string;
    } {
        const { currentBalance, currentRate, newRate, remainingTermMonths, penaltyAmount, closingCosts = 2500 } = params;

        // Calculate 3-month interest penalty if not provided
        const threeMonthPenalty = currentBalance * (currentRate / 100 / 12) * 3;
        const penalty = penaltyAmount ?? threeMonthPenalty;

        const totalCosts = penalty + closingCosts;

        // Current monthly payment (simplified)
        const currentMonthly = currentBalance * (currentRate / 100 / 12);
        const newMonthly = currentBalance * (newRate / 100 / 12);
        const monthlySavings = currentMonthly - newMonthly;

        const breakEvenMonths = monthlySavings > 0 ? Math.ceil(totalCosts / monthlySavings) : Infinity;
        const fiveYearSavings = (monthlySavings * 60) - totalCosts;

        const recommendation = breakEvenMonths < remainingTermMonths && breakEvenMonths < 24
            ? '✅ Refinancing makes financial sense'
            : breakEvenMonths < remainingTermMonths
                ? '⚠️ Consider carefully - break-even period is long'
                : '❌ May not be worth refinancing at this time';

        return {
            monthlySavings: Math.round(monthlySavings),
            breakEvenMonths: breakEvenMonths === Infinity ? -1 : breakEvenMonths,
            fiveYearSavings: Math.round(fiveYearSavings),
            formatted: `**Break-Even Analysis**

| Metric | Value |
|--------|-------|
| Current Rate | ${currentRate}% |
| New Rate | ${newRate}% |
| Monthly Savings | $${Math.round(monthlySavings).toLocaleString()} |
| Total Costs | $${Math.round(totalCosts).toLocaleString()} |
| Break-Even | ${breakEvenMonths === Infinity ? 'N/A' : breakEvenMonths + ' months'} |
| 5-Year Net Savings | $${Math.round(fiveYearSavings).toLocaleString()} |

${recommendation}`,
            recommendation,
        };
    }
}

// Export tool definitions for registration
export const calculatorTools: MortgageTool[] = [
    {
        name: 'calculate_cap_rate',
        description: 'Calculate capitalization rate for commercial real estate',
        parameters: null,
        execute: async (params: { noi: number; marketValue: number }) => {
            const calc = CalculatorTools.getInstance();
            const result = calc.calculateCapRate(params);
            return {
                success: true,
                data: result,
                formattedResult: result.formatted + (result.warning ? `\n\n${result.warning}` : ''),
            };
        },
    },
    {
        name: 'calculate_noi',
        description: 'Calculate Net Operating Income for commercial property',
        parameters: null,
        execute: async (params: { grossRent: number; otherIncome?: number; vacancyRate?: number; expenses: number }) => {
            const calc = CalculatorTools.getInstance();
            const result = calc.calculateNOI(params);
            return {
                success: true,
                data: result,
                formattedResult: result.formatted,
            };
        },
    },
    {
        name: 'calculate_mortgage_payment',
        description: 'Calculate monthly mortgage payment',
        parameters: null,
        execute: async (params: { principal: number; rate: number; amortizationYears: number }) => {
            const calc = CalculatorTools.getInstance();
            const result = calc.calculatePayment(params);
            return {
                success: true,
                data: result,
                formattedResult: result.formatted,
            };
        },
    },
    {
        name: 'calculate_affordability',
        description: 'Calculate how much mortgage a buyer can afford',
        parameters: null,
        execute: async (params: { annualIncome: number; downPayment: number; monthlyDebts?: number; rate?: number }) => {
            const calc = CalculatorTools.getInstance();
            const result = calc.calculateAffordability(params);
            return {
                success: true,
                data: result,
                formattedResult: result.formatted,
            };
        },
    },
    {
        name: 'calculate_refinance_breakeven',
        description: 'Calculate break-even analysis for mortgage refinancing',
        parameters: null,
        execute: async (params: { currentBalance: number; currentRate: number; newRate: number; remainingTermMonths: number; penaltyAmount?: number; closingCosts?: number }) => {
            const calc = CalculatorTools.getInstance();
            const result = calc.calculateRefinanceBreakEven(params);
            return {
                success: true,
                data: result,
                formattedResult: result.formatted,
            };
        },
    },
];

export const calculatorToolsInstance = CalculatorTools.getInstance();
