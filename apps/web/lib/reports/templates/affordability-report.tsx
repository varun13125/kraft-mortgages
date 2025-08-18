import React from "react";
import { 
  BaseReportTemplate, 
  ReportData, 
  ReportSection, 
  ReportTable, 
  ReportHighlight 
} from "./base-template";

interface AffordabilityReportData extends ReportData {
  calculationData: {
    income: number;
    debts: number;
    downPayment: number;
    rate: number;
    propertyTax: number;
    heating: number;
    condoFees: number;
    results: {
      maxPurchase: number;
      maxMortgage: number;
      requiredDown: number;
      monthlyPayment: number;
      gds: number;
      tds: number;
      stressTestRate: number;
    };
  };
}

export const AffordabilityReport: React.FC<{ data: AffordabilityReportData }> = ({ data }) => {
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

  return (
    <BaseReportTemplate data={data}>
      {/* Key Results */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <ReportHighlight
          label="Maximum Purchase Price"
          value={formatCurrency(data.calculationData.results.maxPurchase)}
          color="gold"
        />
        <ReportHighlight
          label="Maximum Mortgage Amount"
          value={formatCurrency(data.calculationData.results.maxMortgage)}
          color="blue"
        />
      </div>

      {/* Input Parameters */}
      <ReportSection title="Your Financial Information">
        <ReportTable
          data={[
            { label: "Annual Household Income", value: formatCurrency(data.calculationData.income) },
            { label: "Monthly Debt Payments", value: formatCurrency(data.calculationData.debts) },
            { label: "Available Down Payment", value: formatCurrency(data.calculationData.downPayment) },
            { label: "Interest Rate", value: formatPercent(data.calculationData.rate) },
            { label: "Stress Test Rate", value: formatPercent(data.calculationData.results.stressTestRate) }
          ]}
        />
      </ReportSection>

      {/* Property Costs */}
      <ReportSection title="Estimated Property Costs">
        <ReportTable
          data={[
            { label: "Property Tax (Monthly)", value: formatCurrency(data.calculationData.propertyTax) },
            { label: "Heating Costs (Monthly)", value: formatCurrency(data.calculationData.heating) },
            { label: "Condo Fees (Monthly)", value: data.calculationData.condoFees > 0 ? formatCurrency(data.calculationData.condoFees) : "N/A" },
            { label: "Estimated Mortgage Payment", value: formatCurrency(data.calculationData.results.monthlyPayment) }
          ]}
        />
      </ReportSection>

      {/* Qualification Ratios */}
      <ReportSection title="Qualification Ratios">
        <div style={{ marginBottom: '20px' }}>
          <ReportTable
            data={[
              { label: "Gross Debt Service (GDS) Ratio", value: formatPercent(data.calculationData.results.gds) },
              { label: "Total Debt Service (TDS) Ratio", value: formatPercent(data.calculationData.results.tds) }
            ]}
          />
        </div>
        
        <div style={{ 
          backgroundColor: data.calculationData.results.gds <= 39 ? '#10B98110' : '#EF444410',
          border: `1px solid ${data.calculationData.results.gds <= 39 ? '#10B981' : '#EF4444'}`,
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#1F2937', margin: 0 }}>
            <strong>GDS Status:</strong> {data.calculationData.results.gds <= 39 ? '✅ Within Guidelines' : '⚠️ Above Guidelines'}
          </p>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
            Maximum recommended GDS ratio is 39%
          </p>
        </div>

        <div style={{ 
          backgroundColor: data.calculationData.results.tds <= 44 ? '#10B98110' : '#EF444410',
          border: `1px solid ${data.calculationData.results.tds <= 44 ? '#10B981' : '#EF4444'}`,
          borderRadius: '8px',
          padding: '15px',
          marginTop: '15px'
        }}>
          <p style={{ color: '#1F2937', margin: 0 }}>
            <strong>TDS Status:</strong> {data.calculationData.results.tds <= 44 ? '✅ Within Guidelines' : '⚠️ Above Guidelines'}
          </p>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
            Maximum recommended TDS ratio is 44%
          </p>
        </div>
      </ReportSection>

      {/* Next Steps */}
      <ReportSection title="Recommended Next Steps">
        <ol style={{ color: '#1F2937', lineHeight: '1.8' }}>
          <li>Review this affordability assessment with your mortgage broker</li>
          <li>Get a formal pre-approval to confirm your purchasing power</li>
          <li>Consider your comfort level with the monthly payments</li>
          <li>Factor in additional costs like moving, legal fees, and home insurance</li>
          <li>Start shopping for homes within your approved price range</li>
        </ol>
      </ReportSection>

      {/* Additional Information */}
      <div style={{ 
        backgroundColor: '#FEF3C7',
        border: '1px solid #F59E0B',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h4 style={{ color: '#92400E', marginTop: 0 }}>Important Notes</h4>
        <ul style={{ color: '#92400E', fontSize: '14px', marginBottom: 0 }}>
          <li>This is an estimate based on the information provided</li>
          <li>Actual approval amounts may vary based on full application review</li>
          <li>The stress test rate is used to ensure you can handle rate increases</li>
          <li>Additional documentation will be required for formal approval</li>
        </ul>
      </div>
    </BaseReportTemplate>
  );
};