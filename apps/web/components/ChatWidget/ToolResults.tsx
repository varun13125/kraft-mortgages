"use client";
import { motion } from "framer-motion";
import { Calculator, FileText, Calendar, TrendingUp, CheckCircle, XCircle, Info } from "lucide-react";

interface ToolResultProps {
  toolName: string;
  result: any;
  displayType?: "table" | "card" | "list" | "text" | "chart";
}

export function ToolResults({ toolName, result, displayType = "card" }: ToolResultProps) {
  const getToolIcon = (name: string) => {
    if (name.includes("calculate") || name.includes("affordability") || name.includes("payment")) {
      return <Calculator className="w-5 h-5" />;
    }
    if (name.includes("document")) {
      return <FileText className="w-5 h-5" />;
    }
    if (name.includes("appointment") || name.includes("book") || name.includes("schedule")) {
      return <Calendar className="w-5 h-5" />;
    }
    if (name.includes("rate") || name.includes("investment")) {
      return <TrendingUp className="w-5 h-5" />;
    }
    return <Info className="w-5 h-5" />;
  };

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

  const renderTableResult = (data: any) => {
    if (!data || typeof data !== 'object') return null;
    
    const entries = Object.entries(data);
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {entries.map(([key, value], index) => (
              <tr key={key} className={index % 2 === 0 ? "bg-gray-700/30" : ""}>
                <td className="px-3 py-2 font-medium text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </td>
                <td className="px-3 py-2 text-gray-100">
                  {typeof value === 'number' 
                    ? key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent')
                      ? formatPercent(value)
                      : key.toLowerCase().includes('price') || key.toLowerCase().includes('payment') || key.toLowerCase().includes('amount')
                        ? formatCurrency(value)
                        : value.toLocaleString()
                    : String(value)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCardResult = (data: any) => {
    if (!data || typeof data !== 'object') return null;
    
    // Special handling for affordability results
    if (toolName.includes('affordability') && data.maxPurchase) {
      return (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/20 p-4 rounded-lg border border-gold-500/30">
            <div className="text-2xl font-bold text-gold-400 mb-2">
              {formatCurrency(data.maxPurchase)}
            </div>
            <div className="text-sm text-gray-300">Maximum Purchase Price</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-gray-100">
                {formatCurrency(data.maxMortgage)}
              </div>
              <div className="text-xs text-gray-400">Max Mortgage</div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-gray-100">
                {formatCurrency(data.requiredDown)}
              </div>
              <div className="text-xs text-gray-400">Min Down Payment</div>
            </div>
          </div>
          
          {data.gds && data.tds && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="text-lg font-semibold text-gray-100">
                  {formatPercent(data.gds)}
                </div>
                <div className="text-xs text-gray-400">GDS Ratio</div>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <div className="text-lg font-semibold text-gray-100">
                  {formatPercent(data.tds)}
                </div>
                <div className="text-xs text-gray-400">TDS Ratio</div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Special handling for payment results
    if (toolName.includes('payment') && data.monthlyPayment) {
      return (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-lg border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {formatCurrency(data.monthlyPayment)}
            </div>
            <div className="text-sm text-gray-300">Monthly Payment</div>
          </div>
          
          {data.biweekly && (
            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
              <div className="text-lg font-semibold text-green-400">
                {formatCurrency(data.biweekly.payment)} bi-weekly
              </div>
              <div className="text-xs text-gray-400">
                Save {formatCurrency(data.biweekly.totalSavings)} over the life of mortgage
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-gray-100">
                {formatCurrency(data.totalInterest)}
              </div>
              <div className="text-xs text-gray-400">Total Interest</div>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-gray-100">
                {formatCurrency(data.totalPayments)}
              </div>
              <div className="text-xs text-gray-400">Total Payments</div>
            </div>
          </div>
        </div>
      );
    }
    
    // Default card rendering
    return renderTableResult(data);
  };

  const renderListResult = (data: any) => {
    const items = Array.isArray(data) ? data : data.items || data.list || [];
    
    return (
      <ul className="space-y-2">
        {items.map((item: any, index: number) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-2"
          >
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-200">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </span>
          </motion.li>
        ))}
      </ul>
    );
  };

  const renderResult = () => {
    switch (displayType) {
      case "table":
        return renderTableResult(result);
      case "list":
        return renderListResult(result);
      case "card":
        return renderCardResult(result);
      case "text":
      default:
        return (
          <div className="text-sm text-gray-200 whitespace-pre-wrap">
            {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
    >
      <div className="flex items-center gap-2 mb-3 text-gold-400">
        {getToolIcon(toolName)}
        <span className="text-sm font-medium capitalize">
          {toolName.replace(/_/g, ' ')}
        </span>
      </div>
      
      <div className="text-gray-100">
        {renderResult()}
      </div>
    </motion.div>
  );
}