import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container-tight py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold">Kraft Mortgages Canada Inc.</div>
          <div className="mt-1 text-sm text-slate-600">Multi-unit & CMHC specialists.</div>
        </div>
        <div>
          <div className="font-semibold">MLI Select</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link className="hover:underline" href="/mli-select/overview">Overview</Link></li>
            <li><Link className="hover:underline" href="/mli-select/benefits">Benefits</Link></li>
            <li><Link className="hover:underline" href="/mli-select/calculators">Calculators</Link></li>
            <li><a className="hover:underline" href="/guide.pdf" download>Download Guide (PDF)</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <div className="mt-2 text-sm text-slate-600">
            Surrey, BC • info@kraftmortgages.ca
          </div>
          <Link href="/contact" className="btn btn-outline mt-3">Request a Call</Link>
        </div>
      </div>
      <div className="border-t text-xs text-slate-500 py-4 text-center">
        © {new Date().getFullYear()} Kraft Mortgages Canada Inc. All rights reserved.
      </div>
    </footer>
  );
}
