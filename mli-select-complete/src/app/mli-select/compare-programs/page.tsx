import SectionHero from "@/components/SectionHero";
import Card from "@/components/Card";

export default function Page() {
  return (<>
    <SectionHero title="Compare CMHC Programs" subtitle="Kraft Mortgages • MLI Select" />
    <section className="section-pad">
      <div className="container-tight grid gap-6">
        <Card><div className="prose"><p>MLI Select vs Standard Multi-Unit vs MLI Flex.</p></div></Card>
      </div>
    </section>
  </>);
}
