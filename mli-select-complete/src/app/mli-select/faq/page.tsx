import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";

export default function Page() {
  return (<>
    <SectionHero title="Frequently Asked Questions" subtitle="Kraft Mortgages • MLI Select" />
    <section className="section-pad">
      <div className="container-tight grid gap-6">
        <Card><div className="prose"><p>Common questions and answers about CMHC MLI Select.</p></div></Card>
      </div>
    </section>
  </>);
}
