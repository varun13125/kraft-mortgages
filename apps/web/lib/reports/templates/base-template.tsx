import React from "react";

export interface ReportData {
  title: string;
  generatedDate: Date;
  clientInfo: {
    name: string;
    email: string;
    phone?: string;
    province?: string;
  };
  calculationData: any;
  disclaimer?: string;
}

export interface ReportTemplateProps {
  data: ReportData;
}

export const BaseReportTemplate: React.FC<{ children: React.ReactNode; data: ReportData }> = ({ 
  children, 
  data 
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
      {/* Header */}
      <div style={{ borderBottom: '3px solid #D4AF37', paddingBottom: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#1F2937', fontSize: '28px', margin: 0 }}>Kraft Mortgages</h1>
            <p style={{ color: '#6B7280', margin: '5px 0' }}>Your Trusted Mortgage Partner</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#6B7280', margin: '5px 0' }}>604-593-1550</p>
            <p style={{ color: '#6B7280', margin: '5px 0' }}>info@kraftmortgages.ca</p>
            <p style={{ color: '#6B7280', margin: '5px 0' }}>www.kraftmortgages.ca</p>
          </div>
        </div>
      </div>

      {/* Report Title and Date */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#1F2937', fontSize: '24px', marginBottom: '10px' }}>{data.title}</h2>
        <p style={{ color: '#6B7280' }}>Generated on {formatDate(data.generatedDate)}</p>
      </div>

      {/* Client Info */}
      <div style={{ 
        backgroundColor: '#F9FAFB', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px' 
      }}>
        <h3 style={{ color: '#1F2937', fontSize: '18px', marginBottom: '15px' }}>Prepared For</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <strong style={{ color: '#6B7280' }}>Name:</strong> {data.clientInfo.name}
          </div>
          <div>
            <strong style={{ color: '#6B7280' }}>Email:</strong> {data.clientInfo.email}
          </div>
          {data.clientInfo.phone && (
            <div>
              <strong style={{ color: '#6B7280' }}>Phone:</strong> {data.clientInfo.phone}
            </div>
          )}
          {data.clientInfo.province && (
            <div>
              <strong style={{ color: '#6B7280' }}>Province:</strong> {data.clientInfo.province}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '40px' }}>
        {children}
      </div>

      {/* Disclaimer */}
      {data.disclaimer && (
        <div style={{ 
          borderTop: '1px solid #E5E7EB', 
          paddingTop: '20px', 
          marginTop: '40px' 
        }}>
          <h4 style={{ color: '#6B7280', fontSize: '14px', marginBottom: '10px' }}>Important Disclaimer</h4>
          <p style={{ color: '#9CA3AF', fontSize: '12px', lineHeight: '1.6' }}>
            {data.disclaimer}
          </p>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        borderTop: '2px solid #D4AF37', 
        paddingTop: '20px', 
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#9CA3AF', fontSize: '12px' }}>
          This report is confidential and intended solely for the recipient. 
          The calculations are based on the information provided and current market conditions.
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '10px' }}>
          © {new Date().getFullYear()} Kraft Mortgages. All rights reserved.
        </p>
      </div>
    </div>
  );
};

// Helper components for consistent styling
export const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title, 
  children 
}) => (
  <div style={{ marginBottom: '30px' }}>
    <h3 style={{ 
      color: '#1F2937', 
      fontSize: '20px', 
      borderBottom: '2px solid #E5E7EB',
      paddingBottom: '10px',
      marginBottom: '20px'
    }}>
      {title}
    </h3>
    {children}
  </div>
);

export const ReportTable: React.FC<{ data: Array<{ label: string; value: string | number }> }> = ({ 
  data 
}) => (
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      {data.map((item, index) => (
        <tr key={index} style={{ borderBottom: '1px solid #E5E7EB' }}>
          <td style={{ 
            padding: '12px 0', 
            color: '#6B7280',
            fontWeight: '500'
          }}>
            {item.label}
          </td>
          <td style={{ 
            padding: '12px 0', 
            color: '#1F2937',
            textAlign: 'right',
            fontWeight: '600'
          }}>
            {item.value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const ReportHighlight: React.FC<{ 
  label: string; 
  value: string | number; 
  color?: 'gold' | 'green' | 'blue' | 'red' 
}> = ({ 
  label, 
  value, 
  color = 'gold' 
}) => {
  const colors = {
    gold: '#D4AF37',
    green: '#10B981',
    blue: '#3B82F6',
    red: '#EF4444'
  };

  return (
    <div style={{ 
      backgroundColor: colors[color] + '10',
      border: `2px solid ${colors[color]}`,
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      marginBottom: '20px'
    }}>
      <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ 
        color: colors[color], 
        fontSize: '32px', 
        fontWeight: 'bold',
        margin: 0
      }}>
        {value}
      </p>
    </div>
  );
};