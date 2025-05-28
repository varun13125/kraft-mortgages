import { getFunctions, httpsCallable, Functions } from 'firebase/functions';
import { app as firebaseApp } from '@/lib/firebase/client'; // Your Firebase app instance
import {
  CaseCore,
  // Note: The backend functions might return CaseCore & { id: string } for list/get.
  // The input for create might be Partial<CaseCore> excluding id, createdAt, etc.
} from '@/types/firestore'; // Shared Firestore types

// Type definitions for function responses (align with backend)
interface FunctionResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T; // Generic data field for flexibility
  caseId?: string; // Specific for createCase
  caseData?: CaseCore & { id: string }; // Specific for getCase
  cases?: (CaseCore & { id: string })[]; // Specific for listCases
}

const functionsInstance: Functions = getFunctions(firebaseApp);

// Helper to type callable functions
function getTypedCallable<RequestData, ResponseData>(
  functionName: string
): (data: RequestData) => Promise<ResponseData> {
  return httpsCallable<RequestData, ResponseData>(functionsInstance, functionName);
}

// --- createCase ---
interface CreateCaseRequestData extends Partial<Omit<CaseCore, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'timeline' | 'parties' | 'documentVault' | 'notes' | 'tags'>> {
  // Fields required by backend createCase function, e.g.:
  caseName: string;
  moduleType: CaseCore['moduleType'];
  // Other optional fields from CaseCore that can be set at creation
  caseNumber?: string;
  status?: CaseCore['status'];
  description?: string;
  priority?: CaseCore['priority'];
  assignedUsers?: string[];
}
type CreateCaseResponseData = FunctionResponse<{ caseId: string }>;
const createCase = getTypedCallable<CreateCaseRequestData, CreateCaseResponseData>('createCase');

// --- getCase ---
interface GetCaseRequestData {
  caseId: string;
}
type GetCaseResponseData = FunctionResponse<{ caseData: CaseCore & { id: string } }>;
const getCase = getTypedCallable<GetCaseRequestData, GetCaseResponseData>('getCase');

// --- listCases ---
interface ListCasesRequestData {
  moduleType?: string;
  status?: string;
  limit?: number;
}
type ListCasesResponseData = FunctionResponse<{ cases: (CaseCore & { id: string })[] }>;
const listCases = getTypedCallable<ListCasesRequestData, ListCasesResponseData>('listCases');

// --- updateCase ---
interface UpdateCaseRequestData extends Partial<Omit<CaseCore, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>> {
  caseId: string; // caseId is mandatory for updates
}
type UpdateCaseResponseData = FunctionResponse;
const updateCase = getTypedCallable<UpdateCaseRequestData, UpdateCaseResponseData>('updateCase');

// --- deleteCase ---
interface DeleteCaseRequestData {
  caseId: string;
}
type DeleteCaseResponseData = FunctionResponse;
const deleteCase = getTypedCallable<DeleteCaseRequestData, DeleteCaseResponseData>('deleteCase');

export const caseService = {
  createCase: async (data: CreateCaseRequestData): Promise<CreateCaseResponseData> => {
    const result = await createCase(data);
    return result.data; // Firebase functions return result in `data` property
  },
  getCase: async (data: GetCaseRequestData): Promise<GetCaseResponseData> => {
    const result = await getCase(data);
    return result.data;
  },
  listCases: async (data: ListCasesRequestData = {}): Promise<ListCasesResponseData> => {
    const result = await listCases(data);
    return result.data;
  },
  updateCase: async (data: UpdateCaseRequestData): Promise<UpdateCaseResponseData> => {
    const result = await updateCase(data);
    return result.data;
  },
  deleteCase: async (data: DeleteCaseRequestData): Promise<DeleteCaseResponseData> => {
    const result = await deleteCase(data);
    return result.data;
  },
};

// Example of expected backend response structure (for reference)
// For createCase: { success: true, caseId: "someId", message: "..." }
// For getCase: { success: true, caseData: { id: "someId", ... } }
// For listCases: { success: true, cases: [{ id: "someId", ... }] }
// For update/delete: { success: true, message: "..." }

// The wrapper functions in caseService ensure that we are returning the nested `data` object
// which is the actual payload from our backend functions as defined in functions/src/cases.ts
// (e.g., `return { success: true, caseId: caseRef.id, ... }`)
// The Firebase SDK for callable functions wraps this in an outer `data` object.
// So, `result.data` from the SDK call corresponds to the object returned by the backend function.
// The FunctionResponse<T> type helps to model this.
// However, the backend functions themselves return an object like { success: true, ... }.
// So, `result.data` from the SDK call will be `{ success: true, ... }`.
// My `FunctionResponse` type was slightly misaligned with how the SDK wraps it.
// Let's adjust the service wrappers to return `result.data` directly, as that's the object
// returned by the Cloud Function. The `FunctionResponse` type should match what the Cloud Function returns.

// Correcting the caseService wrappers based on SDK behavior:
// The `httpsCallable` returns a promise that resolves with HttpsCallableResult.
// HttpsCallableResult has a `data` property which is the object returned by the function.
// So, `result.data` is indeed the object `{ success: true, ... }`.
// My FunctionResponse type is correct for defining what the cloud function itself returns.
// The service methods just need to ensure they return that.

// The types for RequestData should also be aligned with what the backend function expects.
// e.g., createCase expects Partial<CaseCore>, but caseName and moduleType are mandatory there.
// UpdateCaseRequestData also needs caseId.
// The current definitions are mostly okay.Okay, I have successfully created `src/lib/firebase/services/caseService.ts` in the previous turn.

Now, I will proceed to **Step 2: Create Case List Page** (`src/app/cases/page.tsx`).
This page will use `ProtectedRoute`, fetch and display cases using `caseService.listCases()`, and include a "Create New Case" button.

I will assume the necessary shadcn/ui components are available.
The `/app/cases` directory might not exist yet.
