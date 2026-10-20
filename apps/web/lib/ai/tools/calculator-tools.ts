/**
 * Calculator Tools for AI Chatbot
 * Allows AI to execute calculations directly in the chat
 */

import type { MortgageTool } from './types';
import { payment, principalFromPayment } from '@/lib/calc/payment';
import { compareRefinance } from '@/lib/calc/refinance';
import { stressTestRate } from '@/lib/calc/affordability';
import { cmhcPremiumRate, minimumDownPayment, INSURED_PRICE_CAP } from '@/lib/calc/cmhc';

/**
 * Largest purchase price supported by a given down payment and a maximum
 * (qualifying) mortgage, honouring Canadian minimum down payment rules and
 * adding the CMHC premium to the loan when down payment is under 20%.
 * Feasibility is monotonic in price, so a bisection search is exact enough.
 */
function maxPriceFor(downPayment: number, maxMortgage: number, amortYears = 25): number {
    if (!(downPayment > 0)) return 0;
    const feasible = (price: number) => {
        if (downPayment < minimumDownPayment(price)) return false;
        const downPct = (downPayment / price) * 100;
        const insured = downPct < 20 && price < INSURED_PRICE_CAP;
        const loan = Math.max(0, price - downPayment) * (1 + (insured ? cmhcPremiumRate(downPct, amortYears) : 0));
        return loan <= maxMortgage;
    };
    let lo = downPayment;
    let hi = downPayment + Math.max(0, maxMortgage) + 1;
    if (!feasible(lo)) return 0;
    for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        if (feasible(mid)) lo = mid; else hi = mid;
    }
    return lo;
}

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
        const capRate = marketValue > 0 ? (noi / marketValue) * 100 : 0;

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
        const expenseRatio = effectiveGrossIncome > 0 ? (expenses / effectiveGrossIncome) * 100 : 0;

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

        const numPayments = amortizationYears * 12;

        // Canadian semi-annual compounding — same helper as /calculators/payment
        // ($500,000 @ 5% / 25 yrs = $2,908.02, not the US-style $2,922.95).
        const monthlyPayment = payment({ principal, annualRatePct: rate, amortYears: amortizationYears, paymentsPerYear: 12 });
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
| Total Interest | $${Math.round(totalInterest).toLocaleString()} |
| Total Cost | $${Math.round(totalCost).toLocaleString()} |

*Canadian semi-annual compounding; assumes the rate stays the same for the full amortization.*`,
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
        // Optional annual property tax / heating (not in the original signature) — same
        // defaults as /calculators/affordability so GDS isn't overstated.
        const extra = params as typeof params & { propertyTax?: number; heating?: number };
        const propertyTax = extra.propertyTax ?? 3000;
        const heating = extra.heating ?? 1200;

        // GDS limit is 39%, TDS limit is 44% (housing = P&I at qualifying rate + tax + heat)
        const monthlyIncome = annualIncome / 12;
        const taxAndHeatMonthly = (propertyTax + heating) / 12;
        const maxHousingCost = monthlyIncome * 0.39 - taxAndHeatMonthly;
        const maxTotalDebt = monthlyIncome * 0.44 - taxAndHeatMonthly - monthlyDebts;

        // Available for mortgage P&I
        const availableForMortgage = Math.max(0, Math.min(maxHousingCost, maxTotalDebt));

        // OSFI stress test: qualify at max(contract + 2%, 5.25%), 25-yr amortization,
        // Canadian semi-annual compounding.
        const qualRate = stressTestRate(rate);
        const maxMortgage = principalFromPayment({ monthlyPayment: availableForMortgage, annualRatePct: qualRate, amortYears: 25 });
        // Respect minimum down payment rules and CMHC premium (added to the loan) when < 20% down
        const maxPurchasePrice = maxPriceFor(downPayment, maxMortgage, 25);

        // Actual monthly payment at the contract rate on the qualifying mortgage
        const monthlyPayment = payment({ principal: maxMortgage, annualRatePct: rate, amortYears: 25, paymentsPerYear: 12 });

        return {
            maxMortgage: Math.round(maxMortgage),
            maxPurchasePrice: Math.round(maxPurchasePrice),
            monthlyPayment: Math.round(monthlyPayment),
            formatted: `**You could afford a home up to ~$${Math.round(maxPurchasePrice / 1000).toLocaleString()}K**

| Calculation | Amount |
|-------------|--------|
| Annual Income | $${annualIncome.toLocaleString()} |
| Down Payment | $${downPayment.toLocaleString()} |
| Max Mortgage (qualifying) | ~$${Math.round(maxMortgage).toLocaleString()} |
| Max Purchase Price | ~$${Math.round(maxPurchasePrice).toLocaleString()} |
| Estimated Monthly Payment | ~$${Math.round(monthlyPayment).toLocaleString()} |

*Based on ${rate}% rate, 25-year amortization, stress tested at ${qualRate.toFixed(2)}% (greater of rate + 2% or 5.25%), GDS 39% / TDS 44% including $${propertyTax.toLocaleString()}/yr property tax and $${heating.toLocaleString()}/yr heating. Max price honours minimum down payment rules and adds the CMHC premium to the loan when down payment is under 20%.*`,
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
        const { currentBalance, currentRate, newRate, remainingTermMonths, penaltyAmount, closingCosts = 2350 } = params; // legal $1,500 + appraisal $500 + discharge $350, as on the web calculator
        // Optional (not in the original signature): amortizations for a payment-based comparison,
        // matching /commercial/calculators/refinance.
        const extra = params as typeof params & { remainingAmortizationYears?: number; newAmortizationYears?: number };

        // Penalty if not provided: higher of 3 months' interest or an IRD approximation
        // (rate differential × remaining term) — same default as the web refinance calculator.
        const threeMonthPenalty = currentBalance * (currentRate / 100 / 12) * 3;
        const irdPenalty = currentBalance * (Math.max(0, currentRate - newRate) / 100 / 12) * Math.max(0, remainingTermMonths);
        const penalty = penaltyAmount ?? Math.max(threeMonthPenalty, irdPenalty);

        const totalCosts = penalty + closingCosts;

        const currentAmortYears = extra.remainingAmortizationYears || 25;
        const comparison = {
            principal: currentBalance, currentRate, newRate, currentAmortYears,
            newAmortYears: extra.newAmortizationYears || currentAmortYears, upfrontCosts: totalCosts,
        };
        const fiveYear = compareRefinance({ ...comparison, horizonMonths: 60 });
        const term = compareRefinance({ ...comparison, horizonMonths: remainingTermMonths });
        const { monthlySavings, breakEvenMonths } = fiveYear;
        const fiveYearSavings = fiveYear.netSavings;
        const recommendation = term.worthwhile
            ? 'Estimated interest savings exceed costs within the remaining term.'
            : 'Costs are not recovered through interest savings within the remaining term.';

        return {
            monthlySavings: Math.round(monthlySavings),
            breakEvenMonths: breakEvenMonths === Infinity ? -1 : breakEvenMonths,
            fiveYearSavings: Math.round(fiveYearSavings),
            formatted: `**Break-Even Analysis**

| Metric | Value |
|--------|-------|
| Current Rate | ${currentRate}% |
| New Rate | ${newRate}% |
| Monthly Payment Reduction | $${Math.round(monthlySavings).toLocaleString()} |
| Penalty${penaltyAmount === undefined ? ' (est., higher of 3-month interest / IRD)' : ''} | $${Math.round(penalty).toLocaleString()} |
| Total Costs | $${Math.round(totalCosts).toLocaleString()} |
| Break-Even | ${breakEvenMonths === Infinity ? 'N/A' : breakEvenMonths + ' months'} |
| 5-Year Net Savings | $${Math.round(fiveYearSavings).toLocaleString()} |

${recommendation}

*Interest savings include remaining-balance differences; payment relief alone is not a saving. Assumes constant rates, fees paid in cash, and ${currentAmortYears} years remaining amortization.*`,
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
