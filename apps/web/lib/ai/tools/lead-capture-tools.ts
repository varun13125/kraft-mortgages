/**
 * Lead Capture Tools for AI Chatbot
 * Allows AI to capture lead information and book callbacks
 */

import { MortgageTool } from './types';

export interface LeadData {
    name?: string;
    email?: string;
    phone?: string;
    preferredTime?: string;
    topic?: string;
    province?: string;
    mortgageType?: string;
    purchasePrice?: number;
    downPayment?: number;
    timeline?: string;
    notes?: string;
}

export class LeadCaptureTools {
    private static instance: LeadCaptureTools;
    private sessionLeads: Map<string, LeadData> = new Map();

    static getInstance(): LeadCaptureTools {
        if (!LeadCaptureTools.instance) {
            LeadCaptureTools.instance = new LeadCaptureTools();
        }
        return LeadCaptureTools.instance;
    }

    /**
     * Store lead data from conversation
     */
    captureLeadData(sessionId: string, data: Partial<LeadData>): LeadData {
        const existing = this.sessionLeads.get(sessionId) || {};
        const updated = { ...existing, ...data };
        this.sessionLeads.set(sessionId, updated);
        return updated;
    }

    /**
     * Get captured lead data
     */
    getLeadData(sessionId: string): LeadData | null {
        return this.sessionLeads.get(sessionId) || null;
    }

    /**
     * Check if we have enough info for a callback
     */
    hasMinimumCallbackInfo(data: LeadData): boolean {
        return !!(data.name && (data.phone || data.email));
    }

    /**
     * Generate form prefill URL
     */
    generateFormPrefillUrl(data: LeadData): string {
        const params = new URLSearchParams();

        if (data.name) params.set('name', data.name);
        if (data.email) params.set('email', data.email);
        if (data.phone) params.set('phone', data.phone);
        if (data.province) params.set('province', data.province);
        if (data.mortgageType) params.set('type', data.mortgageType);
        if (data.purchasePrice) params.set('price', data.purchasePrice.toString());
        if (data.downPayment) params.set('down', data.downPayment.toString());
        if (data.timeline) params.set('timeline', data.timeline);
        if (data.notes) params.set('notes', data.notes);

        return `/contact?${params.toString()}`;
    }

    /**
     * Format callback confirmation
     */
    formatCallbackConfirmation(data: LeadData): string {
        let response = "✅ **Callback Request Submitted**\n\n";
        response += "We've noted your information:\n\n";
        response += `| Field | Value |\n|-------|-------|\n`;

        if (data.name) response += `| Name | ${data.name} |\n`;
        if (data.phone) response += `| Phone | ${data.phone} |\n`;
        if (data.email) response += `| Email | ${data.email} |\n`;
        if (data.preferredTime) response += `| Preferred Time | ${data.preferredTime} |\n`;
        if (data.topic) response += `| Topic | ${data.topic} |\n`;

        response += "\nA Kraft Mortgages specialist will contact you shortly!";

        return response;
    }

    /**
     * Format missing info request
     */
    formatMissingInfoRequest(data: LeadData): string {
        const missing: string[] = [];

        if (!data.name) missing.push("your name");
        if (!data.phone && !data.email) missing.push("your phone number or email");

        if (missing.length === 0) {
            return "I have all the information I need!";
        }

        return `To schedule a callback, I'll need ${missing.join(" and ")}. Could you provide that?`;
    }
}

// Export tool definitions for registration
export const leadCaptureTools: MortgageTool[] = [
    {
        name: 'capture_lead_info',
        description: 'Store lead information collected during conversation',
        parameters: null,
        execute: async (params: { sessionId: string; data: Partial<LeadData> }) => {
            const lead = LeadCaptureTools.getInstance();
            const updated = lead.captureLeadData(params.sessionId, params.data);
            return {
                success: true,
                data: updated,
                formattedResult: `Got it! I've noted that information.`,
            };
        },
    },
    {
        name: 'request_callback',
        description: 'Submit a callback request with collected lead information',
        parameters: null,
        execute: async (params: { sessionId: string; topic?: string; preferredTime?: string }) => {
            const lead = LeadCaptureTools.getInstance();
            const data = lead.getLeadData(params.sessionId);

            if (!data || !lead.hasMinimumCallbackInfo(data)) {
                return {
                    success: false,
                    data: { missingInfo: true },
                    formattedResult: lead.formatMissingInfoRequest(data || {}),
                };
            }

            // Add topic and preferred time to the lead data
            if (params.topic) data.topic = params.topic;
            if (params.preferredTime) data.preferredTime = params.preferredTime;
            lead.captureLeadData(params.sessionId, data);

            // In production, this would submit to CRM/GHL
            // For now, we just format the confirmation
            return {
                success: true,
                data: {
                    leadData: data,
                    submitted: true,
                },
                formattedResult: lead.formatCallbackConfirmation(data),
            };
        },
    },
    {
        name: 'prefill_application',
        description: 'Generate a pre-filled application link with collected information',
        parameters: null,
        execute: async (params: { sessionId: string }) => {
            const lead = LeadCaptureTools.getInstance();
            const data = lead.getLeadData(params.sessionId);

            if (!data) {
                return {
                    success: true,
                    data: { url: '/contact' },
                    formattedResult: "Ready to get started? **[Start Your Application](/contact)**",
                };
            }

            const url = lead.generateFormPrefillUrl(data);
            return {
                success: true,
                data: { url, leadData: data },
                formattedResult: `I've prepared your information! **[Continue to Application](${url})**\n\nYour details will be pre-filled to save you time.`,
            };
        },
    },
];

export const leadCaptureToolsInstance = LeadCaptureTools.getInstance();
