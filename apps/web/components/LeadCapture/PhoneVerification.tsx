"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Shield, CheckCircle } from "lucide-react";

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: (verified: boolean) => void;
  onResend?: () => Promise<void>;
}

export function PhoneVerification({ phoneNumber, onVerified, onResend }: PhoneVerificationProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Clear error when typing
    if (error) setError("");

    // Auto-verify when all digits entered
    if (newCode.every(digit => digit) && newCode.join("").length === 6) {
      verifyCode(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter(c => /\d/.test(c));
    
    const newCode = [...code];
    digits.forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setCode(newCode);

    if (newCode.every(digit => digit)) {
      verifyCode(newCode.join(""));
    }
  };

  const verifyCode = async (verificationCode: string) => {
    setIsVerifying(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept code "123456"
      if (verificationCode === "123456") {
        onVerified(true);
      } else {
        setError("Invalid verification code. Please try again.");
        setCode(["", "", "", "", "", ""]);
        onVerified(false);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      onVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(60);
    setError("");
    
    if (onResend) {
      try {
        await onResend();
      } catch (err) {
        setError("Failed to resend code. Please try again.");
      }
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const masked = cleaned.slice(0, 3) + "-XXX-" + cleaned.slice(-2);
    return masked;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900">Verify Your Phone</h3>
        <p className="text-gray-600 mt-2">
          We've sent a 6-digit code to
        </p>
        <p className="text-gray-900 font-semibold mt-1 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          {formatPhoneNumber(phoneNumber)}
        </p>
      </div>

      {/* Code Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          Enter verification code
        </label>
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all ${
                error ? "border-red-500" : "border-gray-300"
              } ${digit ? "bg-gold-50" : "bg-white"}`}
              disabled={isVerifying}
            />
          ))}
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </div>

      {/* Verifying State */}
      {isVerifying && (
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Verifying code...</span>
        </div>
      )}

      {/* Resend Code */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Didn't receive the code?
        </p>
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`text-sm font-medium transition-colors ${
            canResend 
              ? "text-gold-600 hover:text-gold-700 cursor-pointer" 
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          {canResend ? (
            "Resend Code"
          ) : (
            `Resend in ${resendTimer}s`
          )}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Why verify?</p>
            <p>Phone verification helps us ensure the security of your account and enables us to contact you about your mortgage inquiry.</p>
          </div>
        </div>
      </div>

      {/* Demo Note */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800 text-center">
          <strong>Demo Mode:</strong> Use code <span className="font-mono">123456</span> to verify
        </p>
      </div>
    </motion.div>
  );
}