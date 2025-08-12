import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";

export default function Page() {
  return (<>
    <SectionHero title="What is MLI Select?" subtitle="Kraft Mortgages • MLI Select" />
    <section className="section-pad">
      <div className="container-tight grid gap-6">
        <Card><div className="prose"><p>Earn points for Affordability, Energy Efficiency, and Accessibility. Higher tiers unlock better terms.</p></div></Card>
      </div>
    </section>
  </>);
}
