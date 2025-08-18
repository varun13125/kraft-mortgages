"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Download, Send } from "lucide-react";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  province: string;
  consentToContact: boolean;
  consentToMarketing: boolean;
}

interface LeadFormProps {
  onSubmit: (data: LeadFormData) => Promise<void>;
  reportType?: string;
  calculationData?: any;
  isLoading?: boolean;
}

export function LeadForm({ onSubmit, reportType = "Report", isLoading = false }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    province: "BC",
    consentToContact: false,
    consentToMarketing: false
  });

  const [errors, setErrors] = useState<Partial<LeadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provinces = [
    { value: "BC", label: "British Columbia" },
    { value: "AB", label: "Alberta" },
    { value: "ON", label: "Ontario" }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[\d\s\-\(\)]+$/.test(formData.phone) || formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.consentToContact) {
      newErrors.consentToContact = "You must consent to be contacted";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LeadFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-gold-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Get Your {reportType}</h3>
        <p className="text-gray-600 mt-2">
          Enter your details to receive a personalized report
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="(604) 555-0123"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Province Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={formData.province}
              onChange={(e) => handleInputChange("province", e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent appearance-none"
            >
              {provinces.map(prov => (
                <option key={prov.value} value={prov.value}>
                  {prov.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentToContact}
              onChange={(e) => handleInputChange("consentToContact", e.target.checked)}
              className="mt-1 w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500"
            />
            <span className="text-sm text-gray-600">
              I consent to be contacted about my mortgage inquiry
              <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.consentToContact && (
            <p className="text-red-500 text-xs ml-6">{errors.consentToContact}</p>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consentToMarketing}
              onChange={(e) => handleInputChange("consentToMarketing", e.target.checked)}
              className="mt-1 w-4 h-4 text-gold-600 border-gray-300 rounded focus:ring-gold-500"
            />
            <span className="text-sm text-gray-600">
              Send me helpful mortgage tips and market updates
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-lg shadow-lg hover:from-gold-600 hover:to-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 ${
            (isSubmitting || isLoading) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Get My Report
            </>
          )}
        </motion.button>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Your information is secure and will never be shared with third parties.
          View our <a href="/privacy" className="text-gold-600 hover:underline">Privacy Policy</a>.
        </p>
      </form>
    </motion.div>
  );
}