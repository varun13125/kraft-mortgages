'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderRotate } from '@/components/ui/animated-gradient-border';

interface LeadModalProps {
  open: boolean;
  selectedCalculator: string | null;
  onClose: () => void;
}

/**
 * Client island: lead-capture modal. Extracted from the homepage so the page
 * can be a Server Component. Each input has an accessible aria-label (the
 * original had zero labels — accessibility fix).
 */
export function LeadModal({ open, selectedCalculator, onClose }: LeadModalProps) {
  const [leadData, setLeadData] = useState({
    name: '', email: '', phone: '', loanAmount: '', message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadData, calculatorType: selectedCalculator || '' }),
      });
      if (selectedCalculator) {
        await fetch('/api/calculator-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...leadData, calculatorType: selectedCalculator }),
        });
      }
      alert('Thank you! We\'ll be in touch shortly. Check your email for your personalized report.');
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Thank you! We\'ve received your information and will be in touch shortly.');
    }
    setLeadData({ name: '', email: '', phone: '', loanAmount: '', message: '' });
    onClose();
  };

  const inputClass = 'w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full"
          >
            <BorderRotate animationSpeed={4} borderRadius={16} borderWidth={2} backgroundColor="#1f2937"
              className="w-full p-8 shadow-2xl backdrop-blur-xl"
              gradientColors={{ primary: '#584827', secondary: '#c7a03c', accent: '#f9de90' }}>
              <h3 className="text-xl font-bold text-gray-100 mb-6">
                {selectedCalculator ? 'Get Your Personalized Report' : 'Get Free Mortgage Analysis'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Full Name" required aria-label="Full Name"
                  className={inputClass}
                  value={leadData.name} onChange={(e) => setLeadData({ ...leadData, name: e.target.value })} />
                <input type="email" placeholder="Email Address" required aria-label="Email Address"
                  className={inputClass}
                  value={leadData.email} onChange={(e) => setLeadData({ ...leadData, email: e.target.value })} />
                <input type="tel" placeholder="Phone Number" required aria-label="Phone Number"
                  className={inputClass}
                  value={leadData.phone} onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })} />
                <input type="text" placeholder="Loan Amount Needed (e.g. $500,000)" aria-label="Loan Amount"
                  className={inputClass}
                  value={leadData.loanAmount} onChange={(e) => setLeadData({ ...leadData, loanAmount: e.target.value })} />
                <textarea placeholder="Tell us about your mortgage needs..." rows={3} aria-label="Message"
                  className={`${inputClass} resize-none`}
                  value={leadData.message} onChange={(e) => setLeadData({ ...leadData, message: e.target.value })} />
                <button type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105 shadow-lg">
                  {selectedCalculator ? 'Get Calculator Report' : 'Get Free Analysis'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-4 text-center">Your information is secure and will never be shared</p>
            </BorderRotate>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
