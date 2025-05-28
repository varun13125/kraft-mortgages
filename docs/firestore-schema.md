# Firestore Multi-Tenant Data Structure

This document outlines the Firestore data structure designed for multi-tenancy in the JuriStream application.

## Core Principles:

*   **Tenant Isolation**: All core data related to a specific law firm (tenant) is stored within documents or subcollections under that tenant's unique ID.
*   **User Roles & Claims**: Firebase Auth custom claims (`role`, `tenantId`) are essential for enforcing access control via Firestore security rules. A user's `tenantId` claim dictates which tenant's data they can access.
*   **Scalability**: The structure is designed to allow for a large number of tenants, each with their own set of users, cases, and other data.

## Collections:

### 1. `tenants/{tenantId}`

*   **Description**: Top-level collection where each document represents a tenant (e.g., a law firm).
*   **`tenantId`**: Unique ID for the tenant.
*   **Fields**:
    *   `name`: (String) Official name of the law firm/tenant.
    *   `createdAt`: (Timestamp) Timestamp of tenant creation.
    *   `ownerId`: (String) Firebase UID of the user who initially created/owns the tenant account.
    *   `subscriptionStatus`: (String) e.g., "active", "trial", "pending_setup", "inactive".
    *   `settings`: (Map) Tenant-specific settings (e.g., default currency, timezone).

### 2. `users/{userId}`

*   **Description**: Top-level collection for all platform users, primarily for Firebase Authentication linkage and cross-tenant user management.
*   **`userId`**: Firebase Auth UID.
*   **Fields**:
    *   `email`: (String) User's email (unique).
    *   `displayName`: (String) User's full name.
    *   `photoURL`: (String) URL to user's profile picture (optional).
    *   `createdAt`: (Timestamp) Timestamp of user account creation.
    *   `lastLoginAt`: (Timestamp) Timestamp of last login.
    *   `disabled`: (Boolean) Whether the user account is disabled globally.
    *   `tenants`: (Array of Maps) Links user to tenants and their roles.
        *   Example: `[{ tenantId: "tenantA_id", role: "admin", joinedAt: Timestamp }, { tenantId: "tenantB_id", role: "lawyer", joinedAt: Timestamp }]`
        *   The active `role` and `tenantId` for a session are stored in Firebase Auth custom claims.

### 3. `tenants/{tenantId}/cases/{caseId}`

*   **Description**: Subcollection under each tenant document, containing all cases for that tenant.
*   **`caseId`**: Unique ID for the case (can be auto-generated).
*   **Core Fields (General Matter)**:
    *   `caseName`: (String) Name or title of the case.
    *   `caseNumber`: (String) Internal or official case number (optional, could be user-defined).
    *   `status`: (String) e.g., "Open", "Pending", "Closed", "Archived".
    *   `moduleType`: (String) Identifies the type of case, e.g., "general", "foreclosure", "immigration", "family", "corporate", "criminal". This determines which specific fields/UI are relevant.
    *   `description`: (String) A brief overview of the case.
    *   `createdAt`: (Timestamp) Timestamp of case creation.
    *   `createdBy`: (String) UID of the user who created the case.
    *   `updatedAt`: (Timestamp) Timestamp of last update.
    *   `updatedBy`: (String) UID of the user who last updated the case.
    *   `assignedUsers`: (Array of Strings) UIDs of lawyers/clerks assigned to this case.
    *   `priority`: (String) e.g., "High", "Medium", "Low".
    *   `closedAt`: (Timestamp) Timestamp when the case was closed (if applicable).
*   **Embedded Data Structures**:
    *   `timeline`: (Array of Maps) Chronological record of actions/events.
        *   `{ timestamp: Timestamp, userId: String, userName: String, action: String, details: String|Map }`
    *   `parties`: (Array of Maps) Individuals, organizations, or entities involved in the case.
        *   `{ partyId: String, name: String, roleInCase: String, contactInfo: { email: String, phone: String, address: String }, notes: String }`
    *   `documentVault`: (Array of Maps) Metadata for documents associated with the case.
        *   `{ documentId: String, fileName: String, storagePath: String, uploadedAt: Timestamp, uploaderId: String, uploaderName: String, version: Number, size: Number, mimeType: String, isSigned: Boolean, eSignSessionId: String }`
    *   `notes`: (Array of Maps) Case-specific notes.
        *   `{ noteId: String, text: String, createdAt: Timestamp, createdBy: String, visibility: "internal" | "client" }`
    *   `tags`: (Array of Strings) e.g., ["urgent", "high-value"].
*   **Module-Specific Fields**: (Map) A dedicated map for fields unique to each `moduleType`.
    *   Example for `foreclosureDetails`:
        ```json
        "foreclosureDetails": {
          "propertyAddress": "123 Main St",
          "defaultDate": "YYYY-MM-DD",
          "originalLoanAmount": 500000,
          "outstandingBalance": 450000,
          "lenderName": "Big Bank Corp",
          "stepRates": [
            { "rate": 5.0, "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" },
            { "rate": 5.5, "startDate": "YYYY-MM-DD" }
          ]
        }
        ```
    *   Other modules (`immigrationDetails`, `familyLawDetails`, etc.) will have their own defined structures within this map.

### 4. `tenants/{tenantId}/users_profiles/{userId}` (Tenant-Specific User Profiles)

*   **Description**: Profiles of users *within the context of a specific tenant*. This is distinct from the global `users/{userId}`.
*   **`userId`**: Firebase Auth UID.
*   **Fields**:
    *   `role`: (String) User's role within this tenant (e.g., "admin", "lawyer", "clerk", "client"). This should align with the role in `users/{userId}.tenants` array for this tenant.
    *   `permissions`: (Array of Strings) Specific permissions if a more granular system than roles is needed (optional).
    *   `joinedAt`: (Timestamp) When the user joined this tenant.
    *   `isActiveInTenant`: (Boolean) If the user is currently active for this tenant.

### 5. `tenants/{tenantId}/templates/{templateId}`

*   **Description**: Document templates specific to a tenant.
*   **`templateId`**: Unique ID for the template.
*   **Fields**:
    *   `name`: (String) e.g., "Demand Letter - Foreclosure EN".
    *   `moduleType`: (String) e.g., "foreclosure", "immigration". Links template to case type.
    *   `language`: (String) e.g., "en", "fr".
    *   `content`: (String) The template body (e.g., HTML, Markdown, or specific format for a template engine).
    *   `placeholders`: (Array of Strings) List of placeholder variables used in the template.
    *   `createdAt`: (Timestamp).
    *   `updatedAt`: (Timestamp).

### 6. `tenants/{tenantId}/auditLogs/{logId}`

*   **Description**: Tenant-specific audit trail for significant actions.
*   **`logId`**: Unique ID for the log entry.
*   **Fields**:
    *   `timestamp`: (Timestamp) When the action occurred.
    *   `userId`: (String) UID of the user who performed the action.
    *   `userEmail`: (String) Email of the user for readability.
    *   `action`: (String) Verb describing the action, e.g., "CASE_CREATE", "DOCUMENT_UPLOAD", "USER_INVITE", "CASE_STATUS_CHANGE".
    *   `targetType`: (String) e.g., "case", "document", "user".
    *   `targetId`: (String) ID of the entity affected.
    *   `details`: (Map) Additional context about the event, e.g., `{ caseId: "...", changes: { status: { old: "Open", new: "Pending" } } }`.

## Security Rules Considerations:

*   Rules will primarily use `request.auth.token.tenantId` to match against `resource.data.tenantId` or by checking if `request.auth.uid` has a specific role within the `tenantId` derived from the path (e.g., `get(/databases/$(database)/documents/tenants/$(tenantId)/users_profiles/$(request.auth.uid)).data.role`).
*   Access to the global `users` collection should be restricted, primarily for backend processes or admin users.
*   Tenant creation might be handled by a specific super-admin role or a separate trusted process.
