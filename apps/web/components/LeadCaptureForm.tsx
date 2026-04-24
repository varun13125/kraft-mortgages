"use client";

import Script from "next/script";

interface LeadCaptureFormProps {
    /** Title displayed above the form */
    title?: string;
    /** Description text below the title */
    description?: string;
    /** Height of the form iframe - 'compact' (500px), 'medium' (650px), or 'full' (740px) */
    size?: 'compact' | 'medium' | 'full';
    /** Additional CSS classes for the container */
    className?: string;
    /** Whether to show the background card styling */
    showCard?: boolean;
}

const sizeMap = {
    compact: 500,
    medium: 650,
    full: 740,
};

/**
 * Reusable GHL Lead Capture Form Component
 * Embeds the GoHighLevel form for mortgage lead capture
 */
export default function LeadCaptureForm({
    title = "Get Your Free Mortgage Consultation",
    description = "Fill out the form below and our mortgage specialist will contact you within 24 hours.",
    size = 'medium',
    className = '',
    showCard = true,
}: LeadCaptureFormProps) {
    const height = sizeMap[size];

    const formContent = (
        <>
            {title && (
                <h3 className="text-2xl font-bold text-gray-100 mb-2">{title}</h3>
            )}
            {description && (
                <p className="text-gray-400 mb-4">{description}</p>
            )}
            <div className="w-full" style={{ minHeight: `${height}px` }}>
                <iframe
                    src="https://api.leadconnectorhq.com/widget/form/EWgpdDb4vZV81EZXxWHf"
                    style={{ width: '100%', height: `${height}px`, border: 'none', borderRadius: '8px' }}
                    id={`inline-form-${Math.random().toString(36).slice(2)}`}
                    data-layout="{'id':'INLINE'}"
                    data-trigger-type="alwaysShow"
                    data-trigger-value=""
                    data-activation-type="alwaysActivated"
                    data-activation-value=""
                    data-deactivation-type="neverDeactivate"
                    data-deactivation-value=""
                    data-form-name="Mortgage Lead Capture"
                    data-height={height}
                    data-form-id="EWgpdDb4vZV81EZXxWHf"
                    title="Mortgage Lead Capture"
                />
            </div>
            <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="lazyOnload" />
        </>
    );

    if (!showCard) {
        return <div className={className}>{formContent}</div>;
    }

    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 ${className}`}>
            {formContent}
        </div>
    );
}
