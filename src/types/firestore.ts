import { Timestamp as FirebaseTimestamp } from 'firebase/firestore'; // Using Firebase's Timestamp

// Re-export or define a more generic Timestamp for use in interfaces if preferred
export type Timestamp = FirebaseTimestamp;

// From tenants/{tenantId}/cases/{caseId} -> parties
export interface Party {
  partyId: string;
  name: string;
  roleInCase: string; // e.g., Plaintiff, Defendant, Witness, Client
  contactInfo?: { // Optional contact info block
    email?: string;
    phone?: string;
    address?: string;
  };
  notes?: string; // Optional notes specific to this party
}

// From tenants/{tenantId}/cases/{caseId} -> timeline
export interface TimelineEvent {
  timestamp: Timestamp;
  userId: string; // UID of user who performed action or system if automated
  userName: string; // Name of user for display
  action: string; // e.g., "Case Created", "Document Uploaded", "Status Changed"
  details?: string | Record<string, any>; // Simple string or a map for more complex details
}

// From tenants/{tenantId}/cases/{caseId} -> documentVault
export interface CaseDocumentMetadata {
  documentId: string;
  fileName: string;
  storagePath: string; // Full path in Firebase Storage
  uploadedAt: Timestamp;
  uploaderId: string; // UID of uploader
  uploaderName: string; // Name of uploader
  version?: number;
  size?: number; // In bytes
  mimeType?: string;
  isSigned?: boolean;
  eSignSessionId?: string; // If applicable
}

// From tenants/{tenantId}/cases/{caseId} -> notes
export interface CaseNote {
  noteId: string;
  text: string;
  createdAt: Timestamp;
  createdBy: string; // UID of note creator
  visibility: 'internal' | 'client'; // Example visibility options
}

// Core structure for tenants/{tenantId}/cases/{caseId}
export interface CaseCore {
  id?: string; // Optional: Firestore document ID, often handled separately
  caseName: string;
  caseNumber?: string; // Optional
  status: 'Open' | 'Pending' | 'Closed' | 'Archived'; // Example statuses
  moduleType: 'general' | 'foreclosure' | 'immigration' | 'family' | 'corporate' | 'criminal'; // Add more as needed
  description?: string;
  createdAt: Timestamp;
  createdBy: string; // UID
  updatedAt: Timestamp;
  updatedBy: string; // UID
  assignedUsers?: string[]; // Array of UIDs
  priority?: 'High' | 'Medium' | 'Low';
  closedAt?: Timestamp | null; // Nullable if not closed

  // Embedded Arrays
  timeline: TimelineEvent[];
  parties: Party[];
  documentVault: CaseDocumentMetadata[];
  notes: CaseNote[];
  tags?: string[];

  // Module-specific fields would be a map or a specific interface based on moduleType
  // For 'general' moduleType, it might be empty or have very generic fields.
  // Example:
  // generalDetails?: { [key: string]: any };
  // foreclosureDetails?: ForeclosureCaseDetails; // Define this interface if needed
}

// Basic structure for tenants/{tenantId}
export interface Tenant {
  id: string; // Firestore document ID
  name: string;
  ownerId: string; // UID of the owner/creator
  createdAt: Timestamp;
  subscriptionStatus?: string;
  settings?: Record<string, any>; // Tenant-specific settings
}

// Basic structure for users/{userId} (Global user profile)
export interface UserProfile {
  id?: string; // Firestore document ID (same as UID)
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  disabled?: boolean;
  tenants: Array<{ // Array of tenant memberships
    tenantId: string;
    role: string; // User's role in that specific tenant
    joinedAt: Timestamp;
  }>;
}

// Basic structure for tenants/{tenantId}/users_profiles/{userId} (Tenant-specific user profile)
export interface TenantUserProfile {
  id?: string; // Firestore document ID (same as UID)
  role: string; // e.g., 'admin', 'lawyer', 'clerk', 'client'
  isActiveInTenant: boolean;
  permissions?: string[]; // Optional: more granular permissions
  joinedAt?: Timestamp;
}

// Example for a module-specific detail (can be expanded)
// export interface ForeclosureCaseDetails {
//   propertyAddress: string;
//   defaultDate: Timestamp | string; // Or string if date format is fixed
//   originalLoanAmount?: number;
//   outstandingBalance?: number;
//   // Add other foreclosure-specific fields
// }

// To make CaseCore more flexible for different modules, you could use a generic:
// export interface CaseCore<TModuleDetails = Record<string, any>> {
//   // ... common fields
//   moduleDetails: TModuleDetails;
// }
// Then: const foreclosureCase: CaseCore<ForeclosureCaseDetails> = { ... };
// For now, sticking to the `moduleType` string and optional specific fields in `CaseCore` if needed.
// Or, handle module-specific fields as a map:
// moduleSpecificData?: Record<string, any>;
// This is implicitly covered if moduleType drives interpretation of a general map.
// The schema in `docs/firestore-schema.md` suggests a map like "foreclosureDetails": { ... }
// So, CaseCore could have:
// foreclosureDetails?: ForeclosureCaseDetails;
// immigrationDetails?: ImmigrationCaseDetails;
// etc.
// For this task, `CaseCore` will reflect the general fields, and module-specific parts can be added as needed.
// The `moduleType` field will indicate which specific details to expect.
// A simple way to represent this without defining all module types yet:
// moduleData?: { [key: string]: any };
// This is a common approach.
// Let's add moduleData to CaseCore for now.
// No, the schema doc implies named fields like `foreclosureDetails`.
// I'll stick to the provided schema guide for now. `CaseCore` will be general.
// Users can extend it or use utility types for specific modules.
