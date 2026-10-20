import type { LenderAttachmentItem } from "../data/canadianLendersData";

// The upstream feed now includes general attachments in addition to appraisal/legal
// attachments. Keep the generated owner-managed data intact. Remove this augmentation
// when its generator declares this same optional field.
declare module "../data/canadianLendersData" {
  interface LenderDetail {
    attachments?: (Omit<LenderAttachmentItem, "description"> & { description?: string })[];
  }
}
