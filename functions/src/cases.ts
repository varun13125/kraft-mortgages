// functions/src/cases.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { CaseCore, Party, TimelineEvent, CaseDocumentMetadata, CaseNote } from "./types/firestore"; // Adjust path if needed

// Ensure admin app is initialized (idempotent)
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

// Helper to check auth and tenantId
const ensureAuthenticatedAndHasTenant = (context: functions.https.CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }
  const tenantId = context.auth.token.tenantId;
  if (!tenantId) {
    throw new functions.https.HttpsError("failed-precondition", "User must have a tenantId claim.");
  }
  return tenantId as string;
};

// --- Create Case ---
export const createCase = functions.https.onCall(async (data: Partial<CaseCore>, context) => {
  const tenantId = ensureAuthenticatedAndHasTenant(context);
  const userId = context.auth!.uid;
  const userEmail = context.auth!.token.email || "N/A";

  // Basic validation (extend as needed)
  if (!data.caseName || !data.moduleType) {
    throw new functions.https.HttpsError("invalid-argument", "Case name and module type are required.");
  }

  const newCaseData: CaseCore = {
    // Defaults
    caseNumber: data.caseNumber || "", // Can be generated or user-defined
    status: data.status || "Open",
    description: data.description || "",
    priority: data.priority || "Medium",
    assignedUsers: data.assignedUsers || [userId],
    timeline: data.timeline || [],
    parties: data.parties || [],
    documentVault: data.documentVault || [],
    notes: data.notes || [],
    tags: data.tags || [],
    // Required
    ...data, // Spread incoming data
    caseName: data.caseName,
    moduleType: data.moduleType, // e.g., "general"
    // Timestamps & User Info
    createdAt: admin.firestore.Timestamp.now(),
    createdBy: userId,
    updatedAt: admin.firestore.Timestamp.now(),
    updatedBy: userId,
    // Tenant context (not directly in CaseCore per schema, but used for path)
  };

  try {
    const caseRef = await db.collection("tenants").doc(tenantId).collection("cases").add(newCaseData);
    // Log creation
    await db.collection("tenants").doc(tenantId).collection("auditLogs").add({
        timestamp: admin.firestore.Timestamp.now(),
        userId: userId,
        userEmail: userEmail,
        action: "CASE_CREATE",
        targetType: "case",
        targetId: caseRef.id,
        details: { caseName: newCaseData.caseName, caseId: caseRef.id }
    });
    return { success: true, caseId: caseRef.id, message: "Case created successfully." };
  } catch (error) {
    functions.logger.error("Error creating case:", error);
    throw new functions.https.HttpsError("internal", "Could not create case.", error);
  }
});

// --- Get Case ---
export const getCase = functions.https.onCall(async (data: { caseId: string }, context) => {
  const tenantId = ensureAuthenticatedAndHasTenant(context);
  if (!data.caseId) {
    throw new functions.https.HttpsError("invalid-argument", "Case ID is required.");
  }

  try {
    const caseDoc = await db.collection("tenants").doc(tenantId).collection("cases").doc(data.caseId).get();
    if (!caseDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Case not found.");
    }
    return { success: true, caseData: { id: caseDoc.id, ...caseDoc.data() } as CaseCore & {id: string} };
  } catch (error) {
    functions.logger.error("Error getting case:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "Could not retrieve case.", error);
  }
});

// --- List Cases ---
export const listCases = functions.https.onCall(async (data: { moduleType?: string; status?: string; limit?: number }, context) => {
  const tenantId = ensureAuthenticatedAndHasTenant(context);
  
  let query: admin.firestore.Query = db.collection("tenants").doc(tenantId).collection("cases");

  if (data.moduleType) {
    query = query.where("moduleType", "==", data.moduleType);
  }
  if (data.status) {
    query = query.where("status", "==", data.status);
  }
  query = query.orderBy("createdAt", "desc"); // Default sort
  if (data.limit) {
    query = query.limit(data.limit);
  } else {
    query = query.limit(25); // Default limit
  }

  try {
    const snapshot = await query.get();
    const cases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseCore & {id: string}));
    return { success: true, cases };
  } catch (error) {
    functions.logger.error("Error listing cases:", error);
    throw new functions.https.HttpsError("internal", "Could not list cases.", error);
  }
});

// --- Update Case ---
export const updateCase = functions.https.onCall(async (data: { caseId: string } & Partial<CaseCore>, context) => {
  const tenantId = ensureAuthenticatedAndHasTenant(context);
  const userId = context.auth!.uid;
  const userEmail = context.auth!.token.email || "N/A";

  const { caseId, ...updateData } = data;
  if (!caseId) {
    throw new functions.https.HttpsError("invalid-argument", "Case ID is required for update.");
  }
  if (Object.keys(updateData).length === 0) {
    throw new functions.https.HttpsError("invalid-argument", "No update data provided.");
  }

  const caseRef = db.collection("tenants").doc(tenantId).collection("cases").doc(caseId);

  try {
    // Check if case exists
    const doc = await caseRef.get();
    if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', 'Case not found.');
    }

    await caseRef.update({
      ...updateData,
      updatedAt: admin.firestore.Timestamp.now(),
      updatedBy: userId,
    });
     // Log update
    await db.collection("tenants").doc(tenantId).collection("auditLogs").add({
        timestamp: admin.firestore.Timestamp.now(),
        userId: userId,
        userEmail: userEmail,
        action: "CASE_UPDATE",
        targetType: "case",
        targetId: caseId,
        details: { updatedFields: Object.keys(updateData) }
    });
    return { success: true, message: "Case updated successfully." };
  } catch (error) {
    functions.logger.error("Error updating case:", error);
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "Could not update case.", error);
  }
});

// --- Delete Case (Soft Delete Example) ---
export const deleteCase = functions.https.onCall(async (data: { caseId: string }, context) => {
  const tenantId = ensureAuthenticatedAndHasTenant(context);
  const userId = context.auth!.uid;
  const userEmail = context.auth!.token.email || "N/A";

  if (!data.caseId) {
    throw new functions.https.HttpsError("invalid-argument", "Case ID is required for deletion.");
  }
  
  const caseRef = db.collection("tenants").doc(tenantId).collection("cases").doc(data.caseId);

  try {
    // Soft delete: update status to "Archived" or "Deleted"
    // Or, add a `deletedAt` timestamp.
    // For hard delete, use `caseRef.delete()`.
    await caseRef.update({
      status: "Archived", // Or your preferred soft-delete status
      updatedAt: admin.firestore.Timestamp.now(),
      updatedBy: userId,
    });
    // Log deletion
    await db.collection("tenants").doc(tenantId).collection("auditLogs").add({
        timestamp: admin.firestore.Timestamp.now(),
        userId: userId,
        userEmail: userEmail,
        action: "CASE_DELETE_SOFT", // Or CASE_DELETE_HARD
        targetType: "case",
        targetId: data.caseId,
    });
    return { success: true, message: "Case archived successfully." };
  } catch (error) {
    functions.logger.error("Error deleting case:", error);
    throw new functions.https.HttpsError("internal", "Could not delete case.", error);
  }
});
