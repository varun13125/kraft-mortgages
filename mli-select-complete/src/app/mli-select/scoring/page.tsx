import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";

export default function Page() {
  return (<>
    <SectionHero title="Scoring" subtitle="Kraft Mortgages • MLI Select" />
    <section className="section-pad">
      <div className="container-tight grid gap-6">
        <Card><div className="prose"><p>Interactive breakdown of Affordability, Energy, and Accessibility points.</p></div></Card>
      </div>
    </section>
  </>);
}
