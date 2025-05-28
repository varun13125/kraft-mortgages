// functions/src/index.ts
import * as admin from "firebase-admin";

// Initialize admin app if not already done (e.g. by other functions)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Export custom claims function (from previous step)
export * from "./customClaims"; // Assuming your custom claims function is in customClaims.ts

// Export Case CRUD functions
import * as cases from "./cases";
export const createCase = cases.createCase;
export const getCase = cases.getCase;
export const listCases = cases.listCases;
export const updateCase = cases.updateCase;
export const deleteCase = cases.deleteCase; // Or whatever you named it, e.g., archiveCase
