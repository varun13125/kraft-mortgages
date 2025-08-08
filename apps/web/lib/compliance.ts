export type ComplianceEvent = {
  type: 'AML_KYC' | 'CONSENT' | 'DISCLOSURE' | 'DOCUMENT_UPLOAD';
  userId?: string;
  meta?: Record<string, any>;
};
export async function logCompliance(event: ComplianceEvent) {
  console.info('compliance_event', JSON.stringify(event));
}
