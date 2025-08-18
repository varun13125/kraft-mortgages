import React from "react";
import { 
  BaseReportTemplate, 
  ReportData, 
  ReportSection, 
  ReportTable, 
  ReportHighlight 
} from "./base-template";

interface InvestmentReportData extends ReportData {
  calculationData: {
    propertyDetails: {
      purchasePrice: number;
      downPayment: number;
      mortgageAmount: number;
      interestRate: number;
      amortization: number;
    };
    rentalIncome: {
      monthlyRent: number;
      annualRent: number;
      vacancyRate: number;
      effectiveRent: number;
    };
    expenses: {
      mortgagePayment: number;
      propertyTax: number;
      insurance: number;
      utilities: number;
      maintenance: number;
      propertyManagement: number;
      other: number;
      totalMonthly: number;
      totalAnnual: number;
    };
    analysis: {
      noi: number; // Net Operating Income
      cashFlow: number;
      cashOnCash: number;
      capRate: number;
      dscr: number; // Debt Service Coverage Ratio
      totalROI: number;
      breakEvenOccupancy: number;
    };
  };
}

export const InvestmentReport: React.FC<{ data: InvestmentReportData }> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getCashFlowStatus = (cashFlow: number) => {
    if (cashFlow > 500) return { color: '#10B981', status: 'Excellent', bg: '#D1FAE5' };
    if (cashFlow > 0) return { color: '#F59E0B', status: 'Positive', bg: '#FEF3C7' };
    return { color: '#EF4444', status: 'Negative', bg: '#FEE2E2' };
  };

  const cashFlowStatus = getCashFlowStatus(data.calculationData.analysis.cashFlow);

  return (
    <BaseReportTemplate data={data}>
      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <ReportHighlight
          label="Monthly Cash Flow"
          value={formatCurrency(data.calculationData.analysis.cashFlow)}
          color={data.calculationData.analysis.cashFlow > 0 ? "green" : "red"}
        />
        <ReportHighlight
          label="Cap Rate"
          value={formatPercent(data.calculationData.analysis.capRate)}
          color="blue"
        />
      </div>

      {/* Property Details */}
      <ReportSection title="Property & Financing Details">
        <ReportTable
          data={[
            { label: "Purchase Price", value: formatCurrency(data.calculationData.propertyDetails.purchasePrice) },
            { label: "Down Payment", value: formatCurrency(data.calculationData.propertyDetails.downPayment) },
            { label: "Mortgage Amount", value: formatCurrency(data.calculationData.propertyDetails.mortgageAmount) },
            { label: "Interest Rate", value: formatPercent(data.calculationData.propertyDetails.interestRate) },
            { label: "Amortization", value: `${data.calculationData.propertyDetails.amortization} years` }
          ]}
        />
      </ReportSection>

      {/* Rental Income Analysis */}
      <ReportSection title="Rental Income Analysis">
        <ReportTable
          data={[
            { label: "Monthly Rental Income", value: formatCurrency(data.calculationData.rentalIncome.monthlyRent) },
            { label: "Annual Rental Income", value: formatCurrency(data.calculationData.rentalIncome.annualRent) },
            { label: "Vacancy Rate", value: formatPercent(data.calculationData.rentalIncome.vacancyRate) },
            { label: "Effective Monthly Income", value: formatCurrency(data.calculationData.rentalIncome.effectiveRent) }
          ]}
        />
      </ReportSection>

      {/* Monthly Expenses Breakdown */}
      <ReportSection title="Monthly Operating Expenses">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '12px 0', color: '#6B7280' }}>Mortgage Payment</td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937', fontWeight: '600' }}>
                {formatCurrency(data.calculationData.expenses.mortgagePayment)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '12px 0', color: '#6B7280' }}>Property Tax</td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937' }}>
                {formatCurrency(data.calculationData.expenses.propertyTax)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '12px 0', color: '#6B7280' }}>Insurance</td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937' }}>
                {formatCurrency(data.calculationData.expenses.insurance)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '12px 0', color: '#6B7280' }}>Utilities</td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937' }}>
                {formatCurrency(data.calculationData.expenses.utilities)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
              <td style={{ padding: '12px 0', color: '#6B7280' }}>Maintenance & Repairs</td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937' }}>
                {formatCurrency(data.calculationData.expenses.maintenance)}
              </td>
            </tr>
            {data.calculationData.expenses.propertyManagement > 0 && (
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '12px 0', color: '#6B7280' }}>Property Management</td>
                <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937' }}>
                  {formatCurrency(data.calculationData.expenses.propertyManagement)}
                </td>
              </tr>
            )}
            {data.calculationData.expenses.other > 0 && (
              <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                <td style={{ padding: '12px 0', color: '#6B7280' }}>Other Expenses</td>
                <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937' }}>
                  {formatCurrency(data.calculationData.expenses.other)}
                </td>
              </tr>
            )}
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <td style={{ padding: '12px 0', color: '#1F2937', fontWeight: 'bold' }}>Total Monthly Expenses</td>
              <td style={{ padding: '12px 0', textAlign: 'right', color: '#1F2937', fontWeight: 'bold' }}>
                {formatCurrency(data.calculationData.expenses.totalMonthly)}
              </td>
            </tr>
          </tbody>
        </table>
      </ReportSection>

      {/* Investment Performance Metrics */}
      <ReportSection title="Investment Performance Analysis">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div style={{ 
            backgroundColor: '#F9FAFB',
            borderRadius: '8px',
            padding: '15px',
            border: '1px solid #E5E7EB'
          }}>
            <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '5px' }}>Net Operating Income (NOI)</p>
            <p style={{ color: '#1F2937', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              {formatCurrency(data.calculationData.analysis.noi)}/mo
            </p>
          </div>
          <div style={{ 
            backgroundColor: cashFlowStatus.bg,
            borderRadius: '8px',
            padding: '15px',
            border: `1px solid ${cashFlowStatus.color}`
          }}>
            <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '5px' }}>Monthly Cash Flow</p>
            <p style={{ color: cashFlowStatus.color, fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              {formatCurrency(data.calculationData.analysis.cashFlow)}
            </p>
          </div>
        </div>

        <ReportTable
          data={[
            { label: "Cash-on-Cash Return", value: formatPercent(data.calculationData.analysis.cashOnCash) },
            { label: "Capitalization Rate", value: formatPercent(data.calculationData.analysis.capRate) },
            { label: "Debt Service Coverage Ratio", value: data.calculationData.analysis.dscr.toFixed(2) },
            { label: "Total ROI (Including Equity)", value: formatPercent(data.calculationData.analysis.totalROI) },
            { label: "Break-Even Occupancy", value: formatPercent(data.calculationData.analysis.breakEvenOccupancy) }
          ]}
        />

        {/* Performance Indicators */}
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#1F2937', fontSize: '16px', marginBottom: '15px' }}>Performance Indicators</h4>
          
          {/* DSCR Indicator */}
          <div style={{ 
            backgroundColor: data.calculationData.analysis.dscr >= 1.2 ? '#D1FAE5' : '#FEE2E2',
            border: `1px solid ${data.calculationData.analysis.dscr >= 1.2 ? '#10B981' : '#EF4444'}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px'
          }}>
            <strong style={{ color: data.calculationData.analysis.dscr >= 1.2 ? '#065F46' : '#991B1B' }}>
              DSCR: {data.calculationData.analysis.dscr >= 1.2 ? '✅ Healthy' : '⚠️ Low'}
            </strong>
            <p style={{ fontSize: '12px', margin: '5px 0 0' }}>
              {data.calculationData.analysis.dscr >= 1.2 
                ? 'Property generates sufficient income to cover debt obligations'
                : 'Income may not adequately cover debt service'}
            </p>
          </div>

          {/* Cap Rate Indicator */}
          <div style={{ 
            backgroundColor: data.calculationData.analysis.capRate >= 5 ? '#D1FAE5' : '#FEF3C7',
            border: `1px solid ${data.calculationData.analysis.capRate >= 5 ? '#10B981' : '#F59E0B'}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '10px'
          }}>
            <strong style={{ color: data.calculationData.analysis.capRate >= 5 ? '#065F46' : '#92400E' }}>
              Cap Rate: {data.calculationData.analysis.capRate >= 5 ? '✅ Strong' : '⚠️ Moderate'}
            </strong>
            <p style={{ fontSize: '12px', margin: '5px 0 0' }}>
              {data.calculationData.analysis.capRate >= 5 
                ? 'Good return relative to property value'
                : 'Consider if appreciation potential justifies lower cap rate'}
            </p>
          </div>

          {/* Cash Flow Indicator */}
          <div style={{ 
            backgroundColor: cashFlowStatus.bg,
            border: `1px solid ${cashFlowStatus.color}`,
            borderRadius: '8px',
            padding: '12px'
          }}>
            <strong style={{ color: cashFlowStatus.color === '#10B981' ? '#065F46' : cashFlowStatus.color === '#F59E0B' ? '#92400E' : '#991B1B' }}>
              Cash Flow: {cashFlowStatus.status}
            </strong>
            <p style={{ fontSize: '12px', margin: '5px 0 0' }}>
              {data.calculationData.analysis.cashFlow > 500 
                ? 'Strong positive cash flow provides good buffer'
                : data.calculationData.analysis.cashFlow > 0
                ? 'Positive cash flow but limited buffer for unexpected expenses'
                : 'Negative cash flow requires additional capital investment'}
            </p>
          </div>
        </div>
      </ReportSection>

      {/* 5-Year Projection */}
      <ReportSection title="5-Year Financial Projection">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>Year</th>
              <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #E5E7EB' }}>Annual Cash Flow</th>
              <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #E5E7EB' }}>Cumulative</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map(year => {
              const annualCashFlow = data.calculationData.analysis.cashFlow * 12 * Math.pow(1.02, year - 1);
              const cumulative = Array.from({length: year}, (_, i) => 
                data.calculationData.analysis.cashFlow * 12 * Math.pow(1.02, i)
              ).reduce((a, b) => a + b, 0);
              
              return (
                <tr key={year} style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <td style={{ padding: '10px' }}>Year {year}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{formatCurrency(annualCashFlow)}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{formatCurrency(cumulative)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '10px' }}>
          *Projection assumes 2% annual rent increase and stable expenses
        </p>
      </ReportSection>

      {/* Investment Recommendation */}
      <div style={{ 
        backgroundColor: data.calculationData.analysis.cashFlow > 0 && data.calculationData.analysis.dscr >= 1.2 
          ? '#D1FAE5' : '#FEF3C7',
        border: `2px solid ${data.calculationData.analysis.cashFlow > 0 && data.calculationData.analysis.dscr >= 1.2 
          ? '#10B981' : '#F59E0B'}`,
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h4 style={{ 
          color: data.calculationData.analysis.cashFlow > 0 && data.calculationData.analysis.dscr >= 1.2 
            ? '#065F46' : '#92400E',
          marginTop: 0 
        }}>
          Investment Recommendation
        </h4>
        <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
          {data.calculationData.analysis.cashFlow > 0 && data.calculationData.analysis.dscr >= 1.2
            ? "This property shows strong investment potential with positive cash flow and healthy debt coverage. Consider proceeding with detailed due diligence including property inspection, market analysis, and rental demand verification."
            : data.calculationData.analysis.cashFlow > 0
            ? "This property generates positive cash flow but has limited margin. Consider negotiating purchase price, increasing down payment, or ensuring strong rental demand before proceeding."
            : "This property currently shows negative cash flow. Consider strategies such as increasing rent, reducing expenses, negotiating better purchase terms, or looking for alternative investment opportunities."}
        </p>
      </div>

      {/* Risk Factors */}
      <div style={{ 
        backgroundColor: '#FFF7ED',
        border: '1px solid #FB923C',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h4 style={{ color: '#9A3412', marginTop: 0 }}>Key Risk Factors to Consider</h4>
        <ul style={{ color: '#9A3412', fontSize: '14px', marginBottom: 0, paddingLeft: '20px' }}>
          <li>Vacancy periods and tenant turnover costs</li>
          <li>Unexpected maintenance and repair expenses</li>
          <li>Interest rate changes at renewal</li>
          <li>Property value fluctuations</li>
          <li>Changes in rental market conditions</li>
          <li>Property management challenges</li>
        </ul>
      </div>
    </BaseReportTemplate>
  );
};