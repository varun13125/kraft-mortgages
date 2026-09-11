// Site layout — passthrough only.
// The previous generateMetadata here built the canonical from request headers
// (x-next-url / x-invoke-path), which is unreliable in current Next.js and could
// produce a homepage canonical for unrelated pages. Each page now owns its own
// canonical via its own metadata/generateMetadata export, so no fallback is needed.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
