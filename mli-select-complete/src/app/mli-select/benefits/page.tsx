import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";

export default function Page() {
  return (<>
    <SectionHero title="Benefits by Tier" subtitle="Kraft Mortgages • MLI Select" />
    <section className="section-pad">
      <div className="container-tight grid gap-6">
        <Card><div className="prose"><p>Tier 50/70/100: longer amortization, higher leverage, premium discounts.</p></div></Card>
      </div>
    </section>
  </>);
}
