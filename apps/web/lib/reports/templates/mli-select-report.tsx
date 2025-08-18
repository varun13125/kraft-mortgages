import React from "react";
import { 
  BaseReportTemplate, 
  ReportData, 
  ReportSection, 
  ReportTable, 
  ReportHighlight 
} from "./base-template";

interface MLISelectReportData extends ReportData {
  calculationData: {
    purchasePrice: number;
    downPayment: number;
    downPaymentPercent: number;
    insuredMortgage: number;
    premiumRate: number;
    premiumAmount: number;
    totalMortgage: number;
    ltv: number;
    comparison: {
      withMLI: {
        rate: number;
        payment: number;
        totalInterest: number;
      };
      without20Down: {
        rate: number;
        payment: number;
        totalInterest: number;
        downPaymentRequired: number;
      };
      savings: number;
      monthlyDifference: number;
    };
  };
}

export const MLISelectReport: React.FC<{ data: MLISelectReportData }> = ({ data }) => {
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
      {/* Key Information */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <ReportHighlight
          label="MLI Select Premium"
          value={formatCurrency(data.calculationData.premiumAmount)}
          color="gold"
        />
        <ReportHighlight
          label="Total Mortgage Amount"
          value={formatCurrency(data.calculationData.totalMortgage)}
          color="blue"
        />
      </div>

      {/* Purchase Details */}
      <ReportSection title="Purchase Details">
        <ReportTable
          data={[
            { label: "Purchase Price", value: formatCurrency(data.calculationData.purchasePrice) },
            { label: "Down Payment", value: `${formatCurrency(data.calculationData.downPayment)} (${formatPercent(data.calculationData.downPaymentPercent)})` },
            { label: "Base Mortgage Amount", value: formatCurrency(data.calculationData.insuredMortgage) },
            { label: "Loan-to-Value (LTV)", value: formatPercent(data.calculationData.ltv) }
          ]}
        />
      </ReportSection>

      {/* MLI Premium Calculation */}
      <ReportSection title="Mortgage Loan Insurance Details">
        <ReportTable
          data={[
            { label: "Premium Rate", value: formatPercent(data.calculationData.premiumRate) },
            { label: "Premium Amount", value: formatCurrency(data.calculationData.premiumAmount) },
            { label: "Premium Added to Mortgage", value: "Yes" },
            { label: "Total Mortgage with Premium", value: formatCurrency(data.calculationData.totalMortgage) }
          ]}
        />
        
        <div style={{ 
          backgroundColor: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: '8px',
          padding: '15px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#92400E', margin: 0, fontSize: '14px' }}>
            <strong>Note:</strong> MLI Select is required when your down payment is less than 20%. 
            The premium is typically added to your mortgage amount and paid over the life of the loan.
          </p>
        </div>
      </ReportSection>

      {/* Comparison Analysis */}
      <ReportSection title="MLI Select vs. 20% Down Payment Comparison">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* With MLI Select */}
          <div style={{ 
            backgroundColor: '#DBEAFE',
            borderRadius: '8px',
            padding: '20px',
            border: '2px solid #3B82F6'
          }}>
            <h4 style={{ color: '#1E40AF', marginTop: 0 }}>With MLI Select</h4>
            <div style={{ fontSize: '14px' }}>
              <p style={{ margin: '8px 0' }}>
                <strong>Down Payment:</strong> {formatCurrency(data.calculationData.downPayment)}
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Interest Rate:</strong> {formatPercent(data.calculationData.comparison.withMLI.rate)}
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Monthly Payment:</strong> {formatCurrency(data.calculationData.comparison.withMLI.payment)}
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Total Interest:</strong> {formatCurrency(data.calculationData.comparison.withMLI.totalInterest)}
              </p>
            </div>
          </div>

          {/* Without MLI (20% Down) */}
          <div style={{ 
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            padding: '20px',
            border: '2px solid #9CA3AF'
          }}>
            <h4 style={{ color: '#374151', marginTop: 0 }}>Without MLI (20% Down)</h4>
            <div style={{ fontSize: '14px' }}>
              <p style={{ margin: '8px 0' }}>
                <strong>Down Payment:</strong> {formatCurrency(data.calculationData.comparison.without20Down.downPaymentRequired)}
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Interest Rate:</strong> {formatPercent(data.calculationData.comparison.without20Down.rate)}
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Monthly Payment:</strong> {formatCurrency(data.calculationData.comparison.without20Down.payment)}
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Total Interest:</strong> {formatCurrency(data.calculationData.comparison.without20Down.totalInterest)}
              </p>
            </div>
          </div>
        </div>

        {/* Savings Analysis */}
        <div style={{ 
          backgroundColor: data.calculationData.comparison.savings > 0 ? '#D1FAE5' : '#FEE2E2',
          border: `2px solid ${data.calculationData.comparison.savings > 0 ? '#10B981' : '#EF4444'}`,
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h4 style={{ 
            color: data.calculationData.comparison.savings > 0 ? '#065F46' : '#991B1B',
            marginTop: 0 
          }}>
            MLI Select Advantage
          </h4>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
            <strong>Additional Down Payment Needed for 20%:</strong> {formatCurrency(
              data.calculationData.comparison.without20Down.downPaymentRequired - data.calculationData.downPayment
            )}
          </p>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
            <strong>Monthly Payment Difference:</strong> {formatCurrency(Math.abs(data.calculationData.comparison.monthlyDifference))} 
            {data.calculationData.comparison.monthlyDifference > 0 ? ' higher' : ' lower'} with MLI
          </p>
          <p style={{ fontSize: '14px', margin: '10px 0' }}>
            <strong>Cash Preserved for Other Uses:</strong> {formatCurrency(
              data.calculationData.comparison.without20Down.downPaymentRequired - data.calculationData.downPayment
            )}
          </p>
        </div>
      </ReportSection>

      {/* Benefits of MLI Select */}
      <ReportSection title="Benefits of MLI Select">
        <div style={{ 
          backgroundColor: '#F0FDF4',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Lower down payment requirement:</strong> Buy sooner with as little as 5% down</li>
            <li><strong>Better interest rates:</strong> Insured mortgages often qualify for lower rates</li>
            <li><strong>Preserve cash:</strong> Keep money for renovations, emergencies, or investments</li>
            <li><strong>Enter the market sooner:</strong> Start building equity instead of waiting to save 20%</li>
            <li><strong>Protection for lenders:</strong> Makes you a lower-risk borrower</li>
            <li><strong>Portable coverage:</strong> Can be transferred to a new property in some cases</li>
          </ul>
        </div>
      </ReportSection>

      {/* Premium Rate Table */}
      <ReportSection title="MLI Premium Rate Reference">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #E5E7EB' }}>
                Down Payment Range
              </th>
              <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #E5E7EB' }}>
                Premium Rate
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>5% - 9.99%</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>4.00%</td>
            </tr>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>10% - 14.99%</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>3.10%</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #E5E7EB' }}>15% - 19.99%</td>
              <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>2.80%</td>
            </tr>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <td style={{ padding: '10px' }}>20% or more</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>No MLI Required</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '10px' }}>
          *Rates shown are standard and may vary based on additional factors
        </p>
      </ReportSection>

      {/* Next Steps */}
      <div style={{ 
        backgroundColor: '#EFF6FF',
        border: '1px solid #3B82F6',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h4 style={{ color: '#1E40AF', marginTop: 0 }}>Next Steps</h4>
        <ol style={{ color: '#1E40AF', fontSize: '14px', marginBottom: 0, paddingLeft: '20px' }}>
          <li>Review this MLI analysis with your mortgage broker</li>
          <li>Consider your cash flow needs and investment goals</li>
          <li>Compare the total cost vs. benefits of lower down payment</li>
          <li>Get pre-approved with MLI to know your exact purchasing power</li>
          <li>Factor in the premium when calculating your total mortgage costs</li>
        </ol>
      </div>
    </BaseReportTemplate>
  );
};