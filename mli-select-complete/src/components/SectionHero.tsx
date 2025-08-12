import Link from "next/link";

export default function SectionHero({
  title,
  subtitle,
  ctas = [],
}: {
  title: string;
  subtitle?: string;
  ctas?: { href: string; label: string; primary?: boolean }[];
}) {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50">
      <div className="container-tight section-pad">
        <div className="max-w-3xl">
          <span className="badge badge-tier">CMHC • MLI Select</span>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-brand-blue">
            {title}
          </h1>
          {subtitle && <p className="mt-3 text-slate-700">{subtitle}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {ctas.map((c) => (
              <Link key={c.href} href={c.href} className={`btn ${c.primary ? "btn-primary" : "btn-outline"}`}>
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
