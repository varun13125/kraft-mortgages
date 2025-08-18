import React from "react";
import { 
  BaseReportTemplate, 
  ReportData, 
  ReportSection, 
  ReportTable, 
  ReportHighlight 
} from "./base-template";

interface PaymentReportData extends ReportData {
  calculationData: {
    principal: number;
    rate: number;
    amortization: number;
    frequency: "monthly" | "biweekly";
    results: {
      monthlyPayment: number;
      biweeklyPayment?: number;
      totalInterest: number;
      totalPayments: number;
      biweeklySavings?: number;
      biweeklyTimeSaved?: string;
      paymentBreakdown: {
        principalPortion: number;
        interestPortion: number;
      };
    };
  };
}

export const PaymentReport: React.FC<{ data: PaymentReportData }> = ({ data }) => {
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
      {/* Key Payment Information */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <ReportHighlight
          label="Monthly Payment"
          value={formatCurrency(data.calculationData.results.monthlyPayment)}
          color="gold"
        />
        {data.calculationData.results.biweeklyPayment && (
          <ReportHighlight
            label="Bi-Weekly Payment"
            value={formatCurrency(data.calculationData.results.biweeklyPayment)}
            color="green"
          />
        )}
      </div>

      {/* Mortgage Details */}
      <ReportSection title="Mortgage Details">
        <ReportTable
          data={[
            { label: "Mortgage Amount", value: formatCurrency(data.calculationData.principal) },
            { label: "Interest Rate", value: formatPercent(data.calculationData.rate) },
            { label: "Amortization Period", value: `${data.calculationData.amortization} years` },
            { label: "Payment Frequency", value: data.calculationData.frequency === "monthly" ? "Monthly" : "Bi-Weekly" }
          ]}
        />
      </ReportSection>

      {/* Payment Analysis */}
      <ReportSection title="Total Cost Analysis">
        <ReportTable
          data={[
            { label: "Total Interest Paid", value: formatCurrency(data.calculationData.results.totalInterest) },
            { label: "Total of All Payments", value: formatCurrency(data.calculationData.results.totalPayments) },
            { label: "Principal Amount", value: formatCurrency(data.calculationData.principal) }
          ]}
        />
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            backgroundColor: '#F3F4F6',
            borderRadius: '8px',
            padding: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#6B7280' }}>Interest as % of Total Payments</span>
            <span style={{ 
              color: '#EF4444', 
              fontSize: '20px', 
              fontWeight: 'bold' 
            }}>
              {((data.calculationData.results.totalInterest / data.calculationData.results.totalPayments) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </ReportSection>

      {/* First Payment Breakdown */}
      <ReportSection title="First Payment Breakdown">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ 
            backgroundColor: '#DBEAFE',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#1E40AF', fontSize: '14px', marginBottom: '8px' }}>
              Principal Portion
            </p>
            <p style={{ color: '#1E40AF', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {formatCurrency(data.calculationData.results.paymentBreakdown.principalPortion)}
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#FEE2E2',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#991B1B', fontSize: '14px', marginBottom: '8px' }}>
              Interest Portion
            </p>
            <p style={{ color: '#991B1B', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
              {formatCurrency(data.calculationData.results.paymentBreakdown.interestPortion)}
            </p>
          </div>
        </div>
      </ReportSection>

      {/* Bi-Weekly Savings */}
      {data.calculationData.results.biweeklySavings && (
        <ReportSection title="Accelerated Bi-Weekly Savings">
          <div style={{ 
            backgroundColor: '#D1FAE5',
            border: '2px solid #10B981',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h4 style={{ color: '#065F46', marginTop: 0 }}>
              Switch to Bi-Weekly Payments and Save!
            </h4>
            <ReportTable
              data={[
                { label: "Total Interest Savings", value: formatCurrency(data.calculationData.results.biweeklySavings) },
                { label: "Time Saved", value: data.calculationData.results.biweeklyTimeSaved || "N/A" },
                { label: "Bi-Weekly Payment Amount", value: formatCurrency(data.calculationData.results.biweeklyPayment || 0) }
              ]}
            />
            <p style={{ color: '#065F46', fontSize: '14px', marginTop: '15px', marginBottom: 0 }}>
              By making payments every two weeks instead of monthly, you'll make 26 half-payments per year 
              (equivalent to 13 monthly payments), helping you pay off your mortgage faster.
            </p>
          </div>
        </ReportSection>
      )}

      {/* Payment Schedule Preview */}
      <ReportSection title="Payment Schedule Options">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#6B7280', borderBottom: '2px solid #E5E7EB' }}>
                Frequency
              </th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#6B7280', borderBottom: '2px solid #E5E7EB' }}>
                Payment Amount
              </th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#6B7280', borderBottom: '2px solid #E5E7EB' }}>
                Annual Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', color: '#1F2937' }}>Monthly (12 payments/year)</td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#1F2937', fontWeight: '600' }}>
                {formatCurrency(data.calculationData.results.monthlyPayment)}
              </td>
              <td style={{ padding: '12px', textAlign: 'right', color: '#1F2937' }}>
                {formatCurrency(data.calculationData.results.monthlyPayment * 12)}
              </td>
            </tr>
            {data.calculationData.results.biweeklyPayment && (
              <tr style={{ backgroundColor: '#F0FDF4' }}>
                <td style={{ padding: '12px', color: '#1F2937' }}>Bi-Weekly (26 payments/year)</td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#1F2937', fontWeight: '600' }}>
                  {formatCurrency(data.calculationData.results.biweeklyPayment)}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#1F2937' }}>
                  {formatCurrency(data.calculationData.results.biweeklyPayment * 26)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </ReportSection>

      {/* Tips */}
      <div style={{ 
        backgroundColor: '#EFF6FF',
        border: '1px solid #3B82F6',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '30px'
      }}>
        <h4 style={{ color: '#1E40AF', marginTop: 0 }}>Money-Saving Tips</h4>
        <ul style={{ color: '#1E40AF', fontSize: '14px', marginBottom: 0 }}>
          <li>Consider making lump sum payments on your anniversary date</li>
          <li>Round up your payments to the nearest $50 or $100</li>
          <li>Make an extra payment whenever you receive a bonus or tax refund</li>
          <li>Review your mortgage at renewal to ensure you have the best rate</li>
        </ul>
      </div>
    </BaseReportTemplate>
  );
};