import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Ensure admin app is initialized if not already
if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const customClaimsOnCreateUser = functions.auth.user().onCreate(async (user) => {
  if (user.email && user.email.endsWith("@example.com")) { // Example: Assign 'admin' role to specific domain
    const customClaims = {
      role: "admin",
      tenantId: "default-tenant-admin", // Or derive from user properties if applicable
    };
    try {
      await admin.auth().setCustomUserClaims(user.uid, customClaims);
      functions.logger.info(`Custom claims set for admin user: ${user.uid}`, customClaims);
      // Optional: Update user record in Firestore with role/tenantId
      // await admin.firestore().collection('users').doc(user.uid).set({
      //   email: user.email,
      //   role: customClaims.role,
      //   tenantId: customClaims.tenantId,
      //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // }, { merge: true });
    } catch (error) {
      functions.logger.error("Error setting custom claims for admin user", error);
    }
  } else {
    const defaultClaims = {
      role: "user", // Default role
      tenantId: "default-tenant-user", // Default or placeholder tenantId
    };
    try {
      await admin.auth().setCustomUserClaims(user.uid, defaultClaims);
      functions.logger.info(`Custom claims set for user: ${user.uid}`, defaultClaims);
      // Optional: Update user record in Firestore
      // await admin.firestore().collection('users').doc(user.uid).set({
      //   email: user.email,
      //   role: defaultClaims.role,
      //   tenantId: defaultClaims.tenantId,
      //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
      // }, { merge: true });
    } catch (error) {
      functions.logger.error("Error setting default custom claims for user", error);
    }
  }
  return null;
});
