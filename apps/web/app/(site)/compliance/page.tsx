import { permanentRedirect } from 'next/navigation';

// /compliance was an "under construction" stub competing with the full
// /compliance-security hub for the same intent (and inheriting the homepage
// canonical). Send visitors and crawlers to the real page with a 308.
// (Ideally move this to next.config.mjs redirects alongside /privacy-policy.)
export default function Compliance() {
  permanentRedirect('/compliance-security');
}
