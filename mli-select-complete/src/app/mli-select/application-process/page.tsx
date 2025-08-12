import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";

export default function Page() {
  return (<>
    <SectionHero title="Application Process" subtitle="Kraft Mortgages • MLI Select" />
    <section className="section-pad">
      <div className="container-tight grid gap-6">
        <Card><div className="prose"><p>Step-by-step from pre-application to funding, with documentation checklist.</p></div></Card>
      </div>
    </section>
  </>);
}
